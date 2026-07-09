package br.edu.utfpr.tds.api.service;

/**
 * Excecao base para violacoes de regra de negocio.
 * Convertida em HTTP 422 pelo ApiExceptionHandler.
 */
public class RegraNegocioException extends RuntimeException {

    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
