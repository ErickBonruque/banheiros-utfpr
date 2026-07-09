package br.edu.utfpr.tds.api.service;

public class AvaliacaoDuplicadaException extends RegraNegocioException {

    public AvaliacaoDuplicadaException() {
        super("Você já avaliou este banheiro hoje. Cada banheiro pode ser avaliado uma vez por dia.");
    }
}
