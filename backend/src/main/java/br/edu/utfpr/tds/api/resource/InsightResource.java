package br.edu.utfpr.tds.api.resource;

import br.edu.utfpr.tds.api.dto.CampusPanorama;
import br.edu.utfpr.tds.api.dto.FaixaHorariaStats;
import br.edu.utfpr.tds.api.model.Insight;
import br.edu.utfpr.tds.api.repository.InsightRepository;
import br.edu.utfpr.tds.api.service.InsightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Modulo de inteligencia:
 *  GET  /insights/banheiros/{id}          -> insights persistidos do banheiro
 *  GET  /insights/banheiros/{id}/horarios -> analise de movimentacao por faixa de horario
 *  GET  /insights/campus/{campusId}       -> panorama geral do campus
 *  POST /insights/gerar                   -> (ADMIN) forca a geracao dos insights
 */
@RestController
@RequestMapping("/insights")
public class InsightResource {

    @Autowired
    private InsightRepository insightRepository;

    @Autowired
    private InsightService insightService;

    @GetMapping("/banheiros/{banheiroId}")
    public List<Insight> listarPorBanheiro(@PathVariable Long banheiroId) {
        return insightRepository.findByBanheiroIdOrderByGeradoEmDesc(banheiroId);
    }

    @GetMapping("/banheiros/{banheiroId}/horarios")
    public List<FaixaHorariaStats> analisarHorarios(@PathVariable Long banheiroId) {
        return insightService.analisarHorarios(banheiroId);
    }

    @GetMapping("/campus/{campusId}")
    public CampusPanorama panoramaCampus(@PathVariable Long campusId) {
        return insightService.panoramaCampus(campusId);
    }

    @PostMapping("/gerar")
    public Map<String, Integer> gerar() {
        int gerados = insightService.gerarInsights();
        return Collections.singletonMap("insightsGerados", gerados);
    }
}
