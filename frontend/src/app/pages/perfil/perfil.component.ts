import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { AvaliacaoService } from '../../core/avaliacao.service';
import { Avaliacao, Banheiro, Page, Usuario } from '../../core/models';
import { StarRatingComponent } from '../../shared/star-rating.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StarRatingComponent],
  template: `
    <h1>Meu perfil</h1>

    @if (usuario) {
      <div class="card" style="max-width:480px">
        @if (mensagem) { <div class="alerta sucesso">{{ mensagem }}</div> }
        @if (erro) { <div class="alerta erro">{{ erro }}</div> }

        <p class="muted">
          {{ usuario.email }} · perfil {{ usuario.role }} · desde {{ usuario.dataCriacao }}
        </p>

        <form (ngSubmit)="salvar()">
          <label for="nome">Nome</label>
          <input id="nome" name="nome" [(ngModel)]="nome" required />

          <label for="senha">Nova senha (deixe em branco para manter a atual)</label>
          <input id="senha" name="senha" type="password" [(ngModel)]="novaSenha" minlength="6" />

          <br /><br />
          <button class="botao" type="submit">Salvar alterações</button>
        </form>
      </div>
    }

    <div class="secao">
      <h2>Minhas avaliações</h2>
      @if (!avaliacoes || avaliacoes.content.length === 0) {
        <p class="muted">Você ainda não avaliou nenhum banheiro.</p>
      } @else {
        <table>
          <thead>
            <tr><th>Banheiro</th><th>Data</th><th>Horário</th><th>Nota geral</th></tr>
          </thead>
          <tbody>
            @for (a of avaliacoes.content; track a.id) {
              <tr>
                <td><a [routerLink]="['/banheiros', banheiroDe(a)?.id]">{{ banheiroDe(a)?.identificador }}</a></td>
                <td>{{ a.dataAvaliacao }}</td>
                <td>{{ a.horarioAvaliacao?.slice(0, 5) }}</td>
                <td><app-star-rating [nota]="a.notaGeral" [mostrarNota]="true" /></td>
              </tr>
            }
          </tbody>
        </table>
        @if (avaliacoes.totalPages > 1) {
          <div class="paginacao">
            <button class="botao secundario" style="color:#374151"
                    [disabled]="pagina === 0" (click)="carregar(pagina - 1)">← Anteriores</button>
            <span class="muted">Página {{ pagina + 1 }} de {{ avaliacoes.totalPages }}</span>
            <button class="botao secundario" style="color:#374151"
                    [disabled]="pagina >= avaliacoes.totalPages - 1"
                    (click)="carregar(pagina + 1)">Próximas →</button>
          </div>
        }
      }
    </div>
  `
})
export class PerfilComponent implements OnInit {
  usuario?: Usuario;
  nome = '';
  novaSenha = '';
  mensagem = '';
  erro = '';
  avaliacoes?: Page<Avaliacao>;
  pagina = 0;

  constructor(private auth: AuthService, private avaliacaoService: AvaliacaoService) {}

  ngOnInit(): void {
    this.auth.perfil().subscribe(u => {
      this.usuario = u;
      this.nome = u.nome;
    });
    this.carregar(0);
  }

  carregar(pagina: number): void {
    this.pagina = pagina;
    this.avaliacaoService.minhasAvaliacoes(pagina, 10).subscribe(p => (this.avaliacoes = p));
  }

  salvar(): void {
    this.mensagem = '';
    this.erro = '';
    const dados: any = { nome: this.nome, avatar: this.usuario?.avatar ?? null };
    if (this.novaSenha) dados.senha = this.novaSenha;
    this.auth.atualizarPerfil(dados).subscribe({
      next: u => {
        this.usuario = u;
        this.novaSenha = '';
        this.mensagem = 'Perfil atualizado com sucesso!';
      },
      error: err => {
        const mensagens = err.error?.erros?.map((e: any) => e.mensagem).join(' ');
        this.erro = mensagens || 'Não foi possível atualizar o perfil.';
      }
    });
  }

  banheiroDe(a: Avaliacao): Banheiro | undefined {
    return a.banheiro as Banheiro | undefined;
  }
}
