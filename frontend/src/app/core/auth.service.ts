import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_URL } from './api';
import { TokenResponse, Usuario } from './models';

const TOKEN_KEY = 'accessToken';

/**
 * Autenticacao com JWT: o access token retornado pela API e guardado no
 * localStorage e enviado pelo AuthInterceptor. As roles vem do payload
 * do proprio token (claim "roles").
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  logado = signal(false);
  admin = signal(false);
  nomeUsuario = signal('');

  constructor(private http: HttpClient) {
    this.atualizarEstado();
  }

  login(email: string, senha: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${API_URL}/oauth/token`, { email, senha }).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.accessToken);
        this.atualizarEstado();
        this.carregarNome();
      })
    );
  }

  registrar(nome: string, email: string, senha: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${API_URL}/usuarios`, { nome, email, senha });
  }

  logout(): void {
    this.http.delete(`${API_URL}/oauth/token`).subscribe({ error: () => {} });
    this.limparSessao();
  }

  limparSessao(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.atualizarEstado();
  }

  perfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${API_URL}/perfil`);
  }

  atualizarPerfil(dados: { nome: string; avatar?: string | null; senha?: string }): Observable<Usuario> {
    return this.http.put<Usuario>(`${API_URL}/perfil`, dados).pipe(
      tap(u => this.nomeUsuario.set(u.nome))
    );
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private atualizarEstado(): void {
    const payload = this.payloadDoToken();
    const valido = !!payload && (!payload.exp || payload.exp * 1000 > Date.now());
    this.logado.set(valido);
    this.admin.set(valido && (payload.roles || []).includes('ROLE_ADMIN'));
    if (valido) {
      this.carregarNome();
    } else {
      this.nomeUsuario.set('');
    }
  }

  private carregarNome(): void {
    this.perfil().subscribe({
      next: u => this.nomeUsuario.set(u.nome),
      error: () => {}
    });
  }

  private payloadDoToken(): any | null {
    const token = this.token;
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
}
