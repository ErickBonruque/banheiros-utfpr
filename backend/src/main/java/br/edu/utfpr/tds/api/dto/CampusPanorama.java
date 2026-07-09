package br.edu.utfpr.tds.api.dto;

/**
 * Panorama geral de um campus: totais e melhor/pior banheiro.
 */
public class CampusPanorama {

    public static class BanheiroResumo {
        private final Long id;
        private final String identificador;
        private final Double notaMedia;

        public BanheiroResumo(Long id, String identificador, Double notaMedia) {
            this.id = id;
            this.identificador = identificador;
            this.notaMedia = notaMedia;
        }

        public Long getId() { return id; }
        public String getIdentificador() { return identificador; }
        public Double getNotaMedia() { return notaMedia; }
    }

    private final Long campusId;
    private final String campus;
    private final long totalBanheiros;
    private final long totalAvaliacoes;
    private final Double notaMediaGeral;
    private final BanheiroResumo melhorBanheiro;
    private final BanheiroResumo piorBanheiro;

    public CampusPanorama(Long campusId, String campus, long totalBanheiros, long totalAvaliacoes,
                          Double notaMediaGeral, BanheiroResumo melhorBanheiro, BanheiroResumo piorBanheiro) {
        this.campusId = campusId;
        this.campus = campus;
        this.totalBanheiros = totalBanheiros;
        this.totalAvaliacoes = totalAvaliacoes;
        this.notaMediaGeral = notaMediaGeral;
        this.melhorBanheiro = melhorBanheiro;
        this.piorBanheiro = piorBanheiro;
    }

    public Long getCampusId() { return campusId; }
    public String getCampus() { return campus; }
    public long getTotalBanheiros() { return totalBanheiros; }
    public long getTotalAvaliacoes() { return totalAvaliacoes; }
    public Double getNotaMediaGeral() { return notaMediaGeral; }
    public BanheiroResumo getMelhorBanheiro() { return melhorBanheiro; }
    public BanheiroResumo getPiorBanheiro() { return piorBanheiro; }
}
