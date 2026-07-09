package br.edu.utfpr.tds.api.dto;

/**
 * Estatisticas de uma faixa de horario, usadas na analise temporal
 * de movimentacao/tranquilidade de um banheiro.
 */
public class FaixaHorariaStats {

    private final String faixa;
    private final String periodo;
    private final long totalAvaliacoes;
    private final Double mediaMovimentacao;
    private final Double mediaSilencio;
    private final Double indiceTranquilidade;

    public FaixaHorariaStats(String faixa, String periodo, long totalAvaliacoes,
                             Double mediaMovimentacao, Double mediaSilencio, Double indiceTranquilidade) {
        this.faixa = faixa;
        this.periodo = periodo;
        this.totalAvaliacoes = totalAvaliacoes;
        this.mediaMovimentacao = mediaMovimentacao;
        this.mediaSilencio = mediaSilencio;
        this.indiceTranquilidade = indiceTranquilidade;
    }

    public String getFaixa() { return faixa; }
    public String getPeriodo() { return periodo; }
    public long getTotalAvaliacoes() { return totalAvaliacoes; }
    public Double getMediaMovimentacao() { return mediaMovimentacao; }
    public Double getMediaSilencio() { return mediaSilencio; }
    public Double getIndiceTranquilidade() { return indiceTranquilidade; }
}
