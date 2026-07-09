import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="card form-estreito">
      <h2>Criar conta</h2>
      <p class="muted">Cadastre-se para avaliar e comentar os banheiros do campus.</p>

      @if (erro) {
        <div class="alerta erro">{{ erro }}</div>
      }

      <form (ngSubmit)="registrar()">
        <label for="nome">Nome</label>
        <input id="nome" name="nome" [(ngModel)]="nome" required />

        <label for="email">E-mail</label>
        <input id="email" name="email" type="email" [(ngModel)]="email" required />

        <label for="senha">Senha</label>
        <input id="senha" name="senha" type="password" [(ngModel)]="senha" required minlength="6" />

        <br /><br />
        <button class="botao" type="submit" [disabled]="carregando">
          {{ carregando ? 'Criando conta...' : 'Criar conta' }}
        </button>
      </form>

      <p class="muted">Já tem conta? <a routerLink="/login">Entrar</a></p>
    </div>
  `
})
export class RegistroComponent {
  nome = '';
  email = '';
  senha = '';
  erro = '';
  carregando = false;

  constructor(private auth: AuthService, private router: Router) {}

  registrar(): void {
    this.erro = '';
    this.carregando = true;
    this.auth.registrar(this.nome, this.email, this.senha).subscribe({
      next: () => {
        // Login automatico apos o cadastro
        this.auth.login(this.email, this.senha).subscribe({
          next: () => this.router.navigate(['/']),
          error: () => this.router.navigate(['/login'])
        });
      },
      error: err => {
        this.carregando = false;
        const mensagens = err.error?.erros?.map((e: any) => e.mensagem).join(' ');
        this.erro = mensagens || 'Não foi possível criar a conta. Verifique os dados.';
      }
    });
  }
}
