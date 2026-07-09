package br.edu.utfpr.tds.api.resource;

import br.edu.utfpr.tds.api.event.RecursoCriadoEvent;
import br.edu.utfpr.tds.api.model.Banheiro;
import br.edu.utfpr.tds.api.model.Comentario;
import br.edu.utfpr.tds.api.model.Usuario;
import br.edu.utfpr.tds.api.repository.BanheiroRepository;
import br.edu.utfpr.tds.api.repository.ComentarioRepository;
import br.edu.utfpr.tds.api.repository.UsuarioRepository;
import br.edu.utfpr.tds.api.service.RegraNegocioException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/comentarios")
public class ComentarioResource {

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private BanheiroRepository banheiroRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ApplicationEventPublisher publisher;

    @GetMapping
    public List<Comentario> listar(@RequestParam Long banheiroId) {
        return comentarioRepository.findByBanheiroIdOrderByDataCriacaoDesc(banheiroId);
    }

    @PostMapping
    public ResponseEntity<Comentario> criar(@Valid @RequestBody Comentario comentario,
                                            Authentication authentication,
                                            HttpServletResponse response) {
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RegraNegocioException("Usuário autenticado não encontrado."));

        if (comentario.getBanheiro() == null || comentario.getBanheiro().getId() == null) {
            throw new RegraNegocioException("Informe o banheiro do comentário.");
        }
        Banheiro banheiro = banheiroRepository.findById(comentario.getBanheiro().getId())
                .orElseThrow(() -> new EmptyResultDataAccessException(1));

        comentario.setId(null);
        comentario.setUsuario(usuario);
        comentario.setBanheiro(banheiro);
        comentario.setDataCriacao(LocalDateTime.now());

        Comentario salvo = comentarioRepository.save(comentario);
        publisher.publishEvent(new RecursoCriadoEvent(this, response, salvo.getId()));
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id) {
        comentarioRepository.deleteById(id);
    }
}
