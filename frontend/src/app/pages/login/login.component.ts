import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="card form-estreito">
      <h2>Entrar</h2>
      <p class="muted">Acesse sua conta para avaliar os banheiros do campus.</p>

      @if (erro) {
        <div class="alerta erro">{{ erro }}</div>
      }

      <form (ngSubmit)="entrar()">
        <label for="email">E-mail</label>
        <input id="email" name="email" type="email" [(ngModel)]="email" required />

        <label for="senha">Senha</label>
        <input id="senha" name="senha" type="password" [(ngModel)]="senha" required />

        <br /><br />
        <button class="botao" type="submit" [disabled]="carregando">
          {{ carregando ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <p class="muted">Não tem conta? <a routerLink="/registro">Cadastre-se</a></p>
    </div>
  `
})
export class LoginComponent {
  email = '';
  senha = '';
  erro = '';
  carregando = false;

  constructor(private auth: AuthService, private router: Router) {}

  entrar(): void {
    this.erro = '';
    this.carregando = true;
    this.auth.login(this.email, this.senha).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => {
        this.carregando = false;
        this.erro = err.status === 401
          ? 'E-mail ou senha inválidos.'
          : 'Não foi possível entrar. Verifique se a API está no ar.';
      }
    });
  }
}
