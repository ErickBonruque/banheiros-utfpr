package br.edu.utfpr.tds.api.repository;

import br.edu.utfpr.tds.api.model.Insight;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InsightRepository extends JpaRepository<Insight, Long> {

    List<Insight> findByBanheiroIdOrderByGeradoEmDesc(Long banheiroId);

    void deleteByBanheiroId(Long banheiroId);
}
