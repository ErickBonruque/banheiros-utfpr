package br.edu.utfpr.tds.api.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * Comentario livre de um usuario sobre um banheiro, funcionando como um
 * pequeno forum de discussao por banheiro (independente das avaliacoes).
 */
@Entity
@Table(name = "comentario")
@JsonIgnoreProperties(ignoreUnknown = false)
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "banheiro_id")
    private Banheiro banheiro;

    @NotBlank
    @Size(max = 500)
    private String texto;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Banheiro getBanheiro() { return banheiro; }
    public void setBanheiro(Banheiro banheiro) { this.banheiro = banheiro; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}
