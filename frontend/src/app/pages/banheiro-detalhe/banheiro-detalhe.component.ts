import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { AvaliacaoService } from '../../core/avaliacao.service';
import { CatalogoService } from '../../core/catalogo.service';
import { InsightService } from '../../core/insight.service';
import {
  Avaliacao, Banheiro, Comentario, FaixaHorariaStats, Insight, Localizacao, Page
} from '../../core/models';
import { StarRatingComponent } from '../../shared/star-rating.component';

interface CriterioForm {
  campo: keyof Pick<Avaliacao,
    'limpeza' | 'cheiro' | 'papelHigienico' | 'estadoPortas' | 'iluminacao' | 'silencio' | 'movimentacao'>;
  rotulo: string;
}

@Component({
  selector: 'app-banheiro-detalhe',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StarRatingComponent],
  templateUrl: './banheiro-detalhe.component.html'
})
export class BanheiroDetalheComponent implements OnInit {

  banheiroId!: number;
  banheiro?: Banheiro;
  avaliacoes?: Page<Avaliacao>;
  paginaAtual = 0;
  comentarios: Comentario[] = [];
  insights: Insight[] = [];
  horarios: FaixaHorariaStats[] = [];

  criterios: CriterioForm[] = [
    { campo: 'limpeza', rotulo: 'Limpeza' },
    { campo: 'cheiro', rotulo: 'Cheiro' },
    { campo: 'papelHigienico', rotulo: 'Papel higiênico' },
    { campo: 'estadoPortas', rotulo: 'Estado das portas' },
    { campo: 'iluminacao', rotulo: 'Iluminação' },
    { campo: 'silencio', rotulo: 'Silêncio' },
    { campo: 'movimentacao', rotulo: 'Movimentação' }
  ];

  novaAvaliacao: Avaliacao = this.avaliacaoVazia();
  novoComentario = '';
  mensagem = '';
  erro = '';

  constructor(
    private route: ActivatedRoute,
    private catalogo: CatalogoService,
    private avaliacaoService: AvaliacaoService,
    private insightService: InsightService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.banheiroId = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarTudo();
  }

  carregarTudo(): void {
    this.catalogo.buscarBanheiro(this.banheiroId).subscribe(b => (this.banheiro = b));
    this.carregarAvaliacoes(0);
    this.avaliacaoService.listarComentarios(this.banheiroId).subscribe(c => (this.comentarios = c));
    this.insightService.porBanheiro(this.banheiroId).subscribe(i => (this.insights = i));
    this.insightService.horarios(this.banheiroId).subscribe(h => (this.horarios = h));
  }

  carregarAvaliacoes(pagina: number): void {
    this.paginaAtual = pagina;
    this.avaliacaoService.pesquisar(this.banheiroId, pagina, 5).subscribe(p => (this.avaliacoes = p));
  }

  enviarAvaliacao(): void {
    this.mensagem = '';
    this.erro = '';
    this.novaAvaliacao.banheiro = { id: this.banheiroId };
    this.avaliacaoService.criar(this.novaAvaliacao).subscribe({
      next: () => {
        this.mensagem = 'Avaliação registrada com sucesso!';
        this.novaAvaliacao = this.avaliacaoVazia();
        this.carregarTudo();
      },
      error: err => {
        const mensagens = err.error?.erros?.map((e: any) => e.mensagem).join(' ');
        this.erro = mensagens || 'Não foi possível registrar a avaliação.';
      }
    });
  }

  enviarComentario(): void {
    if (!this.novoComentario.trim()) return;
    this.avaliacaoService.comentar(this.banheiroId, this.novoComentario.trim()).subscribe({
      next: () => {
        this.novoComentario = '';
        this.avaliacaoService.listarComentarios(this.banheiroId).subscribe(c => (this.comentarios = c));
      },
      error: () => (this.erro = 'Não foi possível enviar o comentário.')
    });
  }

  formularioValido(): boolean {
    return this.criterios.every(c => (this.novaAvaliacao[c.campo] as number) >= 1);
  }

  nomeLocalizacao(): string {
    const loc = this.banheiro?.localizacao as Localizacao | undefined;
    return loc?.nome ?? '';
  }

  private avaliacaoVazia(): Avaliacao {
    return {
      limpeza: 0, cheiro: 0, papelHigienico: 0, estadoPortas: 0,
      iluminacao: 0, silencio: 0, movimentacao: 0, comentario: ''
    };
  }
}
