package br.edu.utfpr.tds.api.service;

public class BanheiroInativoException extends RegraNegocioException {

    public BanheiroInativoException() {
        super("Não é possível registrar avaliação para um banheiro inativo.");
    }
}
