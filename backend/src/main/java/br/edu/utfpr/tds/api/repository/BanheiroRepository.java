package br.edu.utfpr.tds.api.repository;

import br.edu.utfpr.tds.api.model.Banheiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BanheiroRepository extends JpaRepository<Banheiro, Long> {

    List<Banheiro> findByLocalizacaoId(Long localizacaoId);

    @Query("SELECT b FROM Banheiro b WHERE b.ativo = true ORDER BY b.notaMedia DESC, b.totalAvaliacoes DESC")
    List<Banheiro> findRanking();

    @Query("SELECT b FROM Banheiro b WHERE "
            + "(:localizacaoId IS NULL OR b.localizacao.id = :localizacaoId) AND "
            + "(:campusId IS NULL OR b.localizacao.campus.id = :campusId) AND "
            + "(:tipo IS NULL OR b.tipo = :tipo) AND "
            + "(:acessivel IS NULL OR b.acessivel = :acessivel)")
    List<Banheiro> pesquisar(@Param("localizacaoId") Long localizacaoId,
                             @Param("campusId") Long campusId,
                             @Param("tipo") Banheiro.BanheiroTipo tipo,
                             @Param("acessivel") Boolean acessivel);

    List<Banheiro> findByAtivoTrue();
}
