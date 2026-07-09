package br.edu.utfpr.tds.api.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * Insight gerado automaticamente pelo modulo de inteligencia
 * (job agendado ou geracao manual pelo admin).
 */
@Entity
@Table(name = "insight")
@JsonIgnoreProperties(ignoreUnknown = false)
public class Insight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "banheiro_id")
    private Banheiro banheiro;

    @Enumerated(EnumType.STRING)
    private InsightTipo tipo;

    private String titulo;

    @Column(length = 1000)
    private String descricao;

    /** Dados de apoio em JSON (ex.: medias por faixa de horario). */
    @Column(columnDefinition = "TEXT")
    private String dados;

    @Column(name = "gerado_em")
    private LocalDateTime geradoEm;

    public enum InsightTipo {
        MELHOR_HORARIO, PICO_MOVIMENTO, TENDENCIA, ALERTA, DESTAQUE
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Banheiro getBanheiro() { return banheiro; }
    public void setBanheiro(Banheiro banheiro) { this.banheiro = banheiro; }

    public InsightTipo getTipo() { return tipo; }
    public void setTipo(InsightTipo tipo) { this.tipo = tipo; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getDados() { return dados; }
    public void setDados(String dados) { this.dados = dados; }

    public LocalDateTime getGeradoEm() { return geradoEm; }
    public void setGeradoEm(LocalDateTime geradoEm) { this.geradoEm = geradoEm; }
}
