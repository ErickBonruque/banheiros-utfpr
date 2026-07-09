import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../../core/catalogo.service';
import { InsightService } from '../../core/insight.service';
import { Banheiro, Campus, Localizacao } from '../../core/models';

type Aba = 'campus' | 'localizacoes' | 'banheiros';

/**
 * Painel administrativo (somente ADMIN): cadastro de campus, localizacoes
 * e banheiros, alem da geracao manual dos insights.
 */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {

  aba: Aba = 'banheiros';
  mensagem = '';
  erro = '';

  listaCampus: Campus[] = [];
  localizacoes: Localizacao[] = [];
  banheiros: Banheiro[] = [];

  tiposLocalizacao = ['PREDIO', 'BLOCO', 'AREA_EXTERNA', 'CONTAINER', 'GINASIO', 'BIBLIOTECA', 'OUTRO'];
  tiposBanheiro = ['M', 'F', 'UNISSEX', 'PCD'];

  novoCampus: Campus = { nome: '', cidade: '', estado: 'PR' };
  novaLocalizacao: any = { campusId: null, tipo: 'BLOCO', nome: '', descricao: '' };
  novoBanheiro: any = this.banheiroVazio();
  editandoId: number | null = null;

  constructor(private catalogo: CatalogoService, private insights: InsightService) {}

  ngOnInit(): void {
    this.recarregar();
  }

  recarregar(): void {
    this.catalogo.listarCampus().subscribe(c => (this.listaCampus = c));
    this.catalogo.listarLocalizacoes().subscribe(l => (this.localizacoes = l));
    this.catalogo.listarBanheiros().subscribe(b => (this.banheiros = b));
  }

  trocarAba(aba: Aba): void {
    this.aba = aba;
    this.mensagem = '';
    this.erro = '';
  }

  // ---- Campus ----
  criarCampus(): void {
    this.executar(this.catalogo.criarCampus(this.novoCampus), 'Câmpus cadastrado!', () => {
      this.novoCampus = { nome: '', cidade: '', estado: 'PR' };
    });
  }

  removerCampus(c: Campus): void {
    if (!confirm(`Remover o câmpus "${c.nome}"?`)) return;
    this.executar(this.catalogo.removerCampus(c.id!), 'Câmpus removido.');
  }

  // ---- Localizacoes ----
  criarLocalizacao(): void {
    const body: Localizacao = {
      campus: { id: this.novaLocalizacao.campusId },
      tipo: this.novaLocalizacao.tipo,
      nome: this.novaLocalizacao.nome,
      descricao: this.novaLocalizacao.descricao || null
    };
    this.executar(this.catalogo.criarLocalizacao(body), 'Localização cadastrada!', () => {
      this.novaLocalizacao = { campusId: null, tipo: 'BLOCO', nome: '', descricao: '' };
    });
  }

  removerLocalizacao(l: Localizacao): void {
    if (!confirm(`Remover a localização "${l.nome}"?`)) return;
    this.executar(this.catalogo.removerLocalizacao(l.id!), 'Localização removida.');
  }

  // ---- Banheiros ----
  salvarBanheiro(): void {
    const body: Banheiro = {
      localizacao: { id: this.novoBanheiro.localizacaoId },
      identificador: this.novoBanheiro.identificador,
      andar: this.novoBanheiro.andar === '' || this.novoBanheiro.andar == null
        ? null : Number(this.novoBanheiro.andar),
      tipo: this.novoBanheiro.tipo,
      descricao: this.novoBanheiro.descricao || null,
      qtdCabines: this.novoBanheiro.qtdCabines || null,
      acessivel: !!this.novoBanheiro.acessivel,
      ativo: true
    };

    const requisicao = this.editandoId
      ? this.catalogo.atualizarBanheiro(this.editandoId, body)
      : this.catalogo.criarBanheiro(body);

    this.executar(requisicao, this.editandoId ? 'Banheiro atualizado!' : 'Banheiro cadastrado!', () => {
      this.cancelarEdicao();
    });
  }

  editarBanheiro(b: Banheiro): void {
    this.editandoId = b.id!;
    this.novoBanheiro = {
      localizacaoId: (b.localizacao as Localizacao)?.id,
      identificador: b.identificador,
      andar: b.andar,
      tipo: b.tipo,
      descricao: b.descricao ?? '',
      qtdCabines: b.qtdCabines,
      acessivel: b.acessivel
    };
  }

  cancelarEdicao(): void {
    this.editandoId = null;
    this.novoBanheiro = this.banheiroVazio();
  }

  alternarAtivo(b: Banheiro): void {
    this.executar(
      this.catalogo.atualizarAtivoBanheiro(b.id!, !(b.ativo ?? true)),
      b.ativo ? 'Banheiro desativado.' : 'Banheiro reativado.'
    );
  }

  removerBanheiro(b: Banheiro): void {
    if (!confirm(`Remover o banheiro "${b.identificador}"? As avaliações serão perdidas.`)) return;
    this.executar(this.catalogo.removerBanheiro(b.id!), 'Banheiro removido.');
  }

  // ---- Insights ----
  gerarInsights(): void {
    this.insights.gerar().subscribe({
      next: r => (this.mensagem = `${r.insightsGerados} insights gerados com sucesso!`),
      error: () => (this.erro = 'Não foi possível gerar os insights.')
    });
  }

  nomeCampus(l: Localizacao): string {
    return (l.campus as Campus)?.nome ?? '';
  }

  nomeLocalizacao(b: Banheiro): string {
    return (b.localizacao as Localizacao)?.nome ?? '';
  }

  private executar(obs: any, sucesso: string, aposSucesso?: () => void): void {
    this.mensagem = '';
    this.erro = '';
    obs.subscribe({
      next: () => {
        this.mensagem = sucesso;
        aposSucesso?.();
        this.recarregar();
      },
      error: (err: any) => {
        const mensagens = err.error?.erros?.map((e: any) => `${e.campo}: ${e.mensagem}`).join(' | ');
        this.erro = mensagens || 'Operação não permitida. Verifique se o registro não possui vínculos.';
      }
    });
  }

  private banheiroVazio(): any {
    return {
      localizacaoId: null, identificador: '', andar: null, tipo: 'M',
      descricao: '', qtdCabines: null, acessivel: false
    };
  }
}
