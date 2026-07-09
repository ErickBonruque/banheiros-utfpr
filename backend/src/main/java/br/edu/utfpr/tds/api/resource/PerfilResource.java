package br.edu.utfpr.tds.api.resource;

import br.edu.utfpr.tds.api.model.Avaliacao;
import br.edu.utfpr.tds.api.model.Usuario;
import br.edu.utfpr.tds.api.repository.AvaliacaoRepository;
import br.edu.utfpr.tds.api.repository.UsuarioRepository;
import br.edu.utfpr.tds.api.service.RegraNegocioException;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * Perfil do usuario logado (identificado pelo token JWT):
 *  GET /perfil             -> dados do usuario
 *  PUT /perfil             -> atualiza nome, avatar e (opcionalmente) senha
 *  GET /perfil/avaliacoes  -> historico de avaliacoes do usuario (paginado)
 */
@RestController
@RequestMapping("/perfil")
public class PerfilResource {

    @JsonIgnoreProperties(ignoreUnknown = false)
    public static class PerfilUpdateRequest {

        @NotBlank
        private String nome;

        private String avatar;

        @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
        private String senha;

        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }

        public String getAvatar() { return avatar; }
        public void setAvatar(String avatar) { this.avatar = avatar; }

        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
    }

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public Usuario perfil(Authentication authentication) {
        return buscarUsuario(authentication);
    }

    @PutMapping
    public Usuario atualizar(@Valid @RequestBody PerfilUpdateRequest request, Authentication authentication) {
        Usuario usuario = buscarUsuario(authentication);

        usuario.setNome(request.getNome());
        usuario.setAvatar(request.getAvatar());
        if (request.getSenha() != null && !request.getSenha().isEmpty()) {
            usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        }

        return usuarioRepository.save(usuario);
    }

    @GetMapping("/avaliacoes")
    public Page<Avaliacao> avaliacoes(Authentication authentication, Pageable pageable) {
        return avaliacaoRepository.findByUsuarioEmailOrderByDataAvaliacaoDesc(authentication.getName(), pageable);
    }

    private Usuario buscarUsuario(Authentication authentication) {
        return usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RegraNegocioException("Usuário autenticado não encontrado."));
    }
}
