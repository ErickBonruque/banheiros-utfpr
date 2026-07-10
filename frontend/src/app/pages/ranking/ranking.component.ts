import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogoService } from '../../core/catalogo.service';
import { Banheiro, Localizacao } from '../../core/models';
import { StarRatingComponent } from '../../shared/star-rating.component';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, RouterLink, StarRatingComponent],
  template: `
    <h1>Ranking dos banheiros</h1>
    <p class="muted">Classificação geral pela nota média das avaliações (somente banheiros ativos).</p>

    @if (carregando) {
      <p class="muted">Carregando ranking...</p>
    } @else {
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Banheiro</th>
            <th>Localização</th>
            <th>Nota média</th>
            <th>Avaliações</th>
          </tr>
        </thead>
        <tbody>
          @for (b of banheiros; track b.id; let i = $index) {
            <tr>
              <td><strong>{{ i + 1 }}º</strong></td>
              <td>
                <a [routerLink]="['/banheiros', b.id]">{{ b.identificador }}</a>
                @if (b.selo === 'TRONO_DE_OURO') { <span class="selo ouro">Trono de Ouro</span> }
                @if (b.selo === 'ZONA_DE_RISCO') { <span class="selo risco">Zona de Risco</span> }
              </td>
              <td>{{ nomeLocalizacao(b) }}</td>
              <td><app-star-rating [nota]="b.notaMedia" [mostrarNota]="true" /></td>
              <td>{{ b.totalAvaliacoes }}</td>
            </tr>
          }
        </tbody>
      </table>
    }
  `
})
export class RankingComponent implements OnInit {
  banheiros: Banheiro[] = [];
  carregando = true;

  constructor(private catalogo: CatalogoService) {}

  ngOnInit(): void {
    this.catalogo.ranking().subscribe({
      next: b => {
        this.banheiros = b;
        this.carregando = false;
      },
      error: () => (this.carregando = false)
    });
  }

  nomeLocalizacao(banheiro: Banheiro): string {
    const loc = banheiro.localizacao as Localizacao | undefined;
    return loc?.nome ?? '';
  }
}
