package br.edu.utfpr.tds.api.service;

import br.edu.utfpr.tds.api.model.Avaliacao;
import br.edu.utfpr.tds.api.model.Banheiro;
import br.edu.utfpr.tds.api.model.Usuario;
import br.edu.utfpr.tds.api.repository.AvaliacaoRepository;
import br.edu.utfpr.tds.api.repository.BanheiroRepository;
import br.edu.utfpr.tds.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private BanheiroRepository banheiroRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Registra uma avaliacao aplicando as regras de negocio:
     * - o usuario vem do token JWT (nao do corpo da requisicao);
     * - banheiro inativo nao pode ser avaliado (422);
     * - cada usuario avalia o mesmo banheiro no maximo uma vez por dia (422);
     * - data e horario sao registrados automaticamente pelo servidor;
     * - a nota media do banheiro e recalculada apos salvar.
     */
    public Avaliacao salvar(Avaliacao avaliacao, String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RegraNegocioException("Usuário autenticado não encontrado."));

        if (avaliacao.getBanheiro() == null || avaliacao.getBanheiro().getId() == null) {
            throw new RegraNegocioException("Informe o banheiro da avaliação.");
        }

        Banheiro banheiro = banheiroRepository.findById(avaliacao.getBanheiro().getId())
                .orElseThrow(() -> new EmptyResultDataAccessException(1));

        if (Boolean.FALSE.equals(banheiro.getAtivo())) {
            throw new BanheiroInativoException();
        }

        LocalDate hoje = LocalDate.now();
        if (avaliacaoRepository.existsByUsuarioIdAndBanheiroIdAndDataAvaliacao(usuario.getId(), banheiro.getId(), hoje)) {
            throw new AvaliacaoDuplicadaException();
        }

        avaliacao.setId(null);
        avaliacao.setUsuario(usuario);
        avaliacao.setBanheiro(banheiro);
        avaliacao.setDataAvaliacao(hoje);
        avaliacao.setHorarioAvaliacao(LocalTime.now());

        Avaliacao salva = avaliacaoRepository.save(avaliacao);
        atualizarEstatisticasBanheiro(banheiro.getId());

        return salva;
    }

    private void atualizarEstatisticasBanheiro(Long banheiroId) {
        long total = avaliacaoRepository.countByBanheiroId(banheiroId);
        double media = avaliacaoRepository.calcularNotaMedia(banheiroId).orElse(0.0);

        banheiroRepository.findById(banheiroId).ifPresent(b -> {
            b.setNotaMedia(media);
            b.setTotalAvaliacoes((int) total);
            banheiroRepository.save(b);
        });
    }
}
