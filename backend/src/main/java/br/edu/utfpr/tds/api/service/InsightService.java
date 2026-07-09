package br.edu.utfpr.tds.api.service;

import br.edu.utfpr.tds.api.dto.CampusPanorama;
import br.edu.utfpr.tds.api.dto.FaixaHorariaStats;
import br.edu.utfpr.tds.api.model.Avaliacao;
import br.edu.utfpr.tds.api.model.Banheiro;
import br.edu.utfpr.tds.api.model.Campus;
import br.edu.utfpr.tds.api.model.Insight;
import br.edu.utfpr.tds.api.repository.AvaliacaoRepository;
import br.edu.utfpr.tds.api.repository.BanheiroRepository;
import br.edu.utfpr.tds.api.repository.CampusRepository;
import br.edu.utfpr.tds.api.repository.InsightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Modulo de inteligencia: gera insights a partir das avaliacoes.
 *
 * Os insights sao recalculados periodicamente por um job agendado
 * (cron em banheiros.insights.cron) e tambem podem ser gerados sob
 * demanda pelo admin (POST /insights/gerar).
 */
@Service
public class InsightService {

    /** Faixas de horario usadas na analise temporal. */
    private enum Faixa {
        MANHA("Manhã", "06h às 12h", 6, 12),
        TARDE("Tarde", "12h às 18h", 12, 18),
        NOITE("Noite", "18h às 23h", 18, 23);

        final String nome;
        final String periodo;
        final int horaInicio;
        final int horaFim;

        Faixa(String nome, String periodo, int horaInicio, int horaFim) {
            this.nome = nome;
            this.periodo = periodo;
            this.horaInicio = horaInicio;
            this.horaFim = horaFim;
        }

        boolean contem(Avaliacao a) {
            if (a.getHorarioAvaliacao() == null) return false;
            int hora = a.getHorarioAvaliacao().getHour();
            return hora >= horaInicio && hora < horaFim;
        }
    }

    private static final int MIN_AVALIACOES_TENDENCIA = 4;
    private static final double DELTA_TENDENCIA = 0.3;

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private BanheiroRepository banheiroRepository;

    @Autowired
    private CampusRepository campusRepository;

    @Autowired
    private InsightRepository insightRepository;

    /** Job agendado que recalcula os insights de todos os banheiros ativos. */
    @Scheduled(cron = "${banheiros.insights.cron}")
    @Transactional
    public int gerarInsights() {
        int gerados = 0;
        for (Banheiro banheiro : banheiroRepository.findByAtivoTrue()) {
            gerados += gerarParaBanheiro(banheiro);
        }
        return gerados;
    }

    @Transactional
    public int gerarParaBanheiro(Banheiro banheiro) {
        List<Avaliacao> avaliacoes =
                avaliacaoRepository.findByBanheiroIdOrderByDataAvaliacaoAsc(banheiro.getId());

        insightRepository.deleteByBanheiroId(banheiro.getId());
        if (avaliacoes.isEmpty()) {
            return 0;
        }

        List<Insight> novos = new ArrayList<>();
        melhorHorario(banheiro, avaliacoes).ifPresent(novos::add);
        picoDeMovimento(banheiro, avaliacoes).ifPresent(novos::add);
        tendencia(banheiro, avaliacoes).ifPresent(novos::add);
        selo(banheiro).ifPresent(novos::add);

        insightRepository.saveAll(novos);
        return novos.size();
    }

    /** Analise de movimentacao/tranquilidade por faixa de horario (sob demanda). */
    public List<FaixaHorariaStats> analisarHorarios(Long banheiroId) {
        banheiroRepository.findById(banheiroId)
                .orElseThrow(() -> new EmptyResultDataAccessException(1));

        List<Avaliacao> avaliacoes = avaliacaoRepository.findByBanheiroIdOrderByDataAvaliacaoAsc(banheiroId);
        List<FaixaHorariaStats> stats = new ArrayList<>();

        for (Faixa faixa : Faixa.values()) {
            List<Avaliacao> daFaixa = avaliacoes.stream().filter(faixa::contem).collect(Collectors.toList());
            if (daFaixa.isEmpty()) {
                stats.add(new FaixaHorariaStats(faixa.nome, faixa.periodo, 0, null, null, null));
                continue;
            }
            double mediaMov = media(daFaixa, true);
            double mediaSil = media(daFaixa, false);
            stats.add(new FaixaHorariaStats(faixa.nome, faixa.periodo, daFaixa.size(),
                    arredondar(mediaMov), arredondar(mediaSil), arredondar((mediaMov + mediaSil) / 2)));
        }
        return stats;
    }

    /** Panorama geral do campus: totais, media geral e melhor/pior banheiro. */
    public CampusPanorama panoramaCampus(Long campusId) {
        Campus campus = campusRepository.findById(campusId)
                .orElseThrow(() -> new EmptyResultDataAccessException(1));

        List<Banheiro> banheiros = banheiroRepository.pesquisar(null, campusId, null, null).stream()
                .filter(b -> Boolean.TRUE.equals(b.getAtivo()))
                .collect(Collectors.toList());
        List<Banheiro> avaliados = banheiros.stream()
                .filter(b -> b.getTotalAvaliacoes() != null && b.getTotalAvaliacoes() > 0)
                .collect(Collectors.toList());

        long totalAvaliacoes = avaliados.stream().mapToLong(Banheiro::getTotalAvaliacoes).sum();
        Double mediaGeral = avaliados.isEmpty() ? null : arredondar(
                avaliados.stream().mapToDouble(Banheiro::getNotaMedia).average().orElse(0));

        CampusPanorama.BanheiroResumo melhor = avaliados.stream()
                .max(Comparator.comparingDouble(Banheiro::getNotaMedia))
                .map(InsightService::resumo).orElse(null);
        CampusPanorama.BanheiroResumo pior = avaliados.stream()
                .min(Comparator.comparingDouble(Banheiro::getNotaMedia))
                .map(InsightService::resumo).orElse(null);

        return new CampusPanorama(campus.getId(), campus.getNome(), banheiros.size(),
                totalAvaliacoes, mediaGeral, melhor, pior);
    }

    private Optional<Insight> melhorHorario(Banheiro banheiro, List<Avaliacao> avaliacoes) {
        Faixa melhor = null;
        double melhorIndice = -1;
        StringBuilder dados = new StringBuilder("{");

        for (Faixa faixa : Faixa.values()) {
            List<Avaliacao> daFaixa = avaliacoes.stream().filter(faixa::contem).collect(Collectors.toList());
            Double indice = daFaixa.isEmpty() ? null
                    : (media(daFaixa, true) + media(daFaixa, false)) / 2;

            dados.append(String.format(Locale.US, "\"%s\":%s",
                    faixa.nome.toLowerCase(Locale.ROOT).replace("ã", "a"),
                    indice == null ? "null" : String.format(Locale.US, "%.2f", indice)));
            if (faixa.ordinal() < Faixa.values().length - 1) dados.append(",");

            if (indice != null && indice > melhorIndice) {
                melhorIndice = indice;
                melhor = faixa;
            }
        }
        dados.append("}");

        if (melhor == null) {
            return Optional.empty();
        }

        Insight insight = novoInsight(banheiro, Insight.InsightTipo.MELHOR_HORARIO,
                "Melhor horário para uso",
                String.format(Locale.US,
                        "No período da %s (%s) o banheiro costuma estar mais tranquilo "
                                + "(índice de tranquilidade %.1f/5).",
                        melhor.nome.toLowerCase(Locale.ROOT), melhor.periodo, melhorIndice));
        insight.setDados(dados.toString());
        return Optional.of(insight);
    }

    private Optional<Insight> picoDeMovimento(Banheiro banheiro, List<Avaliacao> avaliacoes) {
        Faixa pico = null;
        double piorMedia = Double.MAX_VALUE;

        for (Faixa faixa : Faixa.values()) {
            List<Avaliacao> daFaixa = avaliacoes.stream().filter(faixa::contem).collect(Collectors.toList());
            if (daFaixa.isEmpty()) continue;
            double mediaMov = media(daFaixa, true); // nota baixa = muito movimento
            if (mediaMov < piorMedia) {
                piorMedia = mediaMov;
                pico = faixa;
            }
        }

        if (pico == null) {
            return Optional.empty();
        }

        return Optional.of(novoInsight(banheiro, Insight.InsightTipo.PICO_MOVIMENTO,
                "Horário de pico",
                String.format(Locale.US,
                        "O período da %s (%s) é o mais movimentado (nota média de movimentação %.1f/5). "
                                + "Se puder, evite esse horário.",
                        pico.nome.toLowerCase(Locale.ROOT), pico.periodo, piorMedia)));
    }

    private Optional<Insight> tendencia(Banheiro banheiro, List<Avaliacao> avaliacoes) {
        if (avaliacoes.size() < MIN_AVALIACOES_TENDENCIA) {
            return Optional.empty();
        }

        int metade = avaliacoes.size() / 2;
        double mediaAntiga = avaliacoes.subList(0, metade).stream()
                .mapToDouble(Avaliacao::getNotaGeral).average().orElse(0);
        double mediaRecente = avaliacoes.subList(metade, avaliacoes.size()).stream()
                .mapToDouble(Avaliacao::getNotaGeral).average().orElse(0);
        double delta = mediaRecente - mediaAntiga;

        String situacao;
        if (delta >= DELTA_TENDENCIA) {
            situacao = "MELHORANDO";
        } else if (delta <= -DELTA_TENDENCIA) {
            situacao = "PIORANDO";
        } else {
            situacao = "ESTÁVEL";
        }

        Insight insight = novoInsight(banheiro, Insight.InsightTipo.TENDENCIA,
                "Tendência de qualidade: " + situacao.toLowerCase(Locale.ROOT),
                String.format(Locale.US,
                        "A nota média foi de %.1f nas avaliações mais antigas para %.1f nas mais recentes.",
                        mediaAntiga, mediaRecente));
        insight.setDados(String.format(Locale.US,
                "{\"mediaAntiga\":%.2f,\"mediaRecente\":%.2f,\"situacao\":\"%s\"}",
                mediaAntiga, mediaRecente, situacao));
        return Optional.of(insight);
    }

    private Optional<Insight> selo(Banheiro banheiro) {
        if (banheiro.getSelo() == Banheiro.Selo.ZONA_DE_RISCO) {
            return Optional.of(novoInsight(banheiro, Insight.InsightTipo.ALERTA,
                    "Zona de Risco",
                    String.format(Locale.US,
                            "Nota média %.1f (abaixo de 2.0). Este banheiro precisa de atenção urgente da manutenção.",
                            banheiro.getNotaMedia())));
        }
        if (banheiro.getSelo() == Banheiro.Selo.TRONO_DE_OURO) {
            return Optional.of(novoInsight(banheiro, Insight.InsightTipo.DESTAQUE,
                    "Trono de Ouro",
                    String.format(Locale.US,
                            "Nota média %.1f (acima de 4.5). Um dos melhores banheiros do campus!",
                            banheiro.getNotaMedia())));
        }
        return Optional.empty();
    }

    private Insight novoInsight(Banheiro banheiro, Insight.InsightTipo tipo, String titulo, String descricao) {
        Insight insight = new Insight();
        insight.setBanheiro(banheiro);
        insight.setTipo(tipo);
        insight.setTitulo(titulo);
        insight.setDescricao(descricao);
        insight.setGeradoEm(LocalDateTime.now());
        return insight;
    }

    private static double media(List<Avaliacao> avaliacoes, boolean movimentacao) {
        return avaliacoes.stream()
                .mapToInt(a -> movimentacao ? a.getMovimentacao() : a.getSilencio())
                .average().orElse(0);
    }

    private static CampusPanorama.BanheiroResumo resumo(Banheiro b) {
        return new CampusPanorama.BanheiroResumo(b.getId(), b.getIdentificador(), arredondar(b.getNotaMedia()));
    }

    private static Double arredondar(double valor) {
        return Math.round(valor * 100) / 100.0;
    }
}
