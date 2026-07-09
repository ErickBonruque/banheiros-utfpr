import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Exibicao e selecao de notas em estrelas (1 a 5).
 * Sem "editavel", apenas mostra a nota; com "editavel", emite a nota clicada.
 */
@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="stars" [class.editavel]="editavel">
      @for (estrela of estrelas; track estrela) {
        <span (click)="selecionar(estrela)"
              [class.cheia]="estrela <= Math.round(nota || 0)">★</span>
      }
      @if (mostrarNota && nota != null) {
        <small class="valor">{{ nota | number: '1.1-1' }}</small>
      }
    </span>
  `,
  styles: [`
    .stars span { color: #d0d4dc; font-size: 1.05rem; }
    .stars span.cheia { color: #f5a623; }
    .stars.editavel span { cursor: pointer; font-size: 1.4rem; }
    .stars.editavel span:hover { transform: scale(1.15); display: inline-block; }
    .valor { margin-left: .35rem; color: #667; }
  `]
})
export class StarRatingComponent {
  @Input() nota: number | null | undefined = 0;
  @Input() editavel = false;
  @Input() mostrarNota = false;
  @Output() notaChange = new EventEmitter<number>();

  estrelas = [1, 2, 3, 4, 5];
  Math = Math;

  selecionar(valor: number): void {
    if (!this.editavel) return;
    this.nota = valor;
    this.notaChange.emit(valor);
  }
}
