import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './api';
import { Avaliacao, Comentario, Page } from './models';

/** Avaliacoes (com paginacao) e comentarios dos banheiros. */
@Injectable({ providedIn: 'root' })
export class AvaliacaoService {

  constructor(private http: HttpClient) {}

  pesquisar(banheiroId: number, page = 0, size = 10): Observable<Page<Avaliacao>> {
    const params = new HttpParams()
      .set('banheiroId', banheiroId)
      .set('page', page)
      .set('size', size)
      .set('sort', 'dataAvaliacao,desc');
    return this.http.get<Page<Avaliacao>>(`${API_URL}/avaliacoes`, { params });
  }

  criar(avaliacao: Avaliacao): Observable<Avaliacao> {
    return this.http.post<Avaliacao>(`${API_URL}/avaliacoes`, avaliacao);
  }

  minhasAvaliacoes(page = 0, size = 10): Observable<Page<Avaliacao>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Avaliacao>>(`${API_URL}/perfil/avaliacoes`, { params });
  }

  listarComentarios(banheiroId: number): Observable<Comentario[]> {
    const params = new HttpParams().set('banheiroId', banheiroId);
    return this.http.get<Comentario[]>(`${API_URL}/comentarios`, { params });
  }

  comentar(banheiroId: number, texto: string): Observable<Comentario> {
    return this.http.post<Comentario>(`${API_URL}/comentarios`, { banheiro: { id: banheiroId }, texto });
  }
}
