import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './api';
import { Banheiro, Campus, Localizacao } from './models';

export interface FiltroBanheiros {
  campusId?: number | null;
  localizacaoId?: number | null;
  tipo?: string | null;
  acessivel?: boolean | null;
}

/** CRUD da estrutura do campus: campus, localizacoes e banheiros. */
@Injectable({ providedIn: 'root' })
export class CatalogoService {

  constructor(private http: HttpClient) {}

  // ---- Campus ----
  listarCampus(): Observable<Campus[]> {
    return this.http.get<Campus[]>(`${API_URL}/campus`);
  }

  criarCampus(campus: Campus): Observable<Campus> {
    return this.http.post<Campus>(`${API_URL}/campus`, campus);
  }

  removerCampus(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/campus/${id}`);
  }

  // ---- Localizacoes ----
  listarLocalizacoes(campusId?: number | null): Observable<Localizacao[]> {
    let params = new HttpParams();
    if (campusId) params = params.set('campusId', campusId);
    return this.http.get<Localizacao[]>(`${API_URL}/localizacoes`, { params });
  }

  criarLocalizacao(localizacao: Localizacao): Observable<Localizacao> {
    return this.http.post<Localizacao>(`${API_URL}/localizacoes`, localizacao);
  }

  removerLocalizacao(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/localizacoes/${id}`);
  }

  // ---- Banheiros ----
  listarBanheiros(filtro: FiltroBanheiros = {}): Observable<Banheiro[]> {
    let params = new HttpParams();
    if (filtro.campusId) params = params.set('campusId', filtro.campusId);
    if (filtro.localizacaoId) params = params.set('localizacaoId', filtro.localizacaoId);
    if (filtro.tipo) params = params.set('tipo', filtro.tipo);
    if (filtro.acessivel != null) params = params.set('acessivel', filtro.acessivel);
    return this.http.get<Banheiro[]>(`${API_URL}/banheiros`, { params });
  }

  buscarBanheiro(id: number): Observable<Banheiro> {
    return this.http.get<Banheiro>(`${API_URL}/banheiros/${id}`);
  }

  ranking(): Observable<Banheiro[]> {
    return this.http.get<Banheiro[]>(`${API_URL}/banheiros/ranking`);
  }

  criarBanheiro(banheiro: Banheiro): Observable<Banheiro> {
    return this.http.post<Banheiro>(`${API_URL}/banheiros`, banheiro);
  }

  atualizarBanheiro(id: number, banheiro: Banheiro): Observable<Banheiro> {
    return this.http.put<Banheiro>(`${API_URL}/banheiros/${id}`, banheiro);
  }

  atualizarAtivoBanheiro(id: number, ativo: boolean): Observable<void> {
    return this.http.patch<void>(`${API_URL}/banheiros/${id}/ativo`, ativo);
  }

  removerBanheiro(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/banheiros/${id}`);
  }
}
