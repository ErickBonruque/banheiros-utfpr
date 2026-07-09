import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './api';
import { CampusPanorama, FaixaHorariaStats, Insight } from './models';

/** Modulo de inteligencia: insights, analise por horario e panorama do campus. */
@Injectable({ providedIn: 'root' })
export class InsightService {

  constructor(private http: HttpClient) {}

  porBanheiro(banheiroId: number): Observable<Insight[]> {
    return this.http.get<Insight[]>(`${API_URL}/insights/banheiros/${banheiroId}`);
  }

  horarios(banheiroId: number): Observable<FaixaHorariaStats[]> {
    return this.http.get<FaixaHorariaStats[]>(`${API_URL}/insights/banheiros/${banheiroId}/horarios`);
  }

  panoramaCampus(campusId: number): Observable<CampusPanorama> {
    return this.http.get<CampusPanorama>(`${API_URL}/insights/campus/${campusId}`);
  }

  gerar(): Observable<{ insightsGerados: number }> {
    return this.http.post<{ insightsGerados: number }>(`${API_URL}/insights/gerar`, {});
  }
}
