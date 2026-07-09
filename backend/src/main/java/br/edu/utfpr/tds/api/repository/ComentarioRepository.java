package br.edu.utfpr.tds.api.repository;

import br.edu.utfpr.tds.api.model.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {

    List<Comentario> findByBanheiroIdOrderByDataCriacaoDesc(Long banheiroId);
}
