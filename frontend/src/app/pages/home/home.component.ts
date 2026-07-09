import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CatalogoService } from '../../core/catalogo.service';
import { InsightService } from '../../core/insight.service';
import { Banheiro, Campus, CampusPanorama, Localizacao } from '../../core/models';
import { StarRatingComponent } from '../../shared/star-rating.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StarRatingComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  banheiros: Banheiro[] = [];
  listaCampus: Campus[] = [];
  localizacoes: Localizacao[] = [];
  panorama?: CampusPanorama;
  carregando = true;

  filtroCampus: number | null = null;
  filtroLocalizacao: number | null = null;
  filtroTipo: string | null = null;
  filtroAcessivel: boolean | null = null;

  tipos = ['M', 'F', 'UNISSEX', 'PCD'];

  constructor(private catalogo: CatalogoService, private insights: InsightService) {}

  ngOnInit(): void {
    this.catalogo.listarCampus().subscribe(campus => {
      this.listaCampus = campus;
      // Seleciona o primeiro campus por padrao para exibir o panorama
      if (campus.length > 0) {
        this.filtroCampus = campus[0].id!;
        this.aoTrocarCampus();
      } else {
        this.buscar();
      }
    });
  }

  aoTrocarCampus(): void {
    this.filtroLocalizacao = null;
    if (this.filtroCampus) {
      this.catalogo.listarLocalizacoes(this.filtroCampus).subscribe(l => (this.localizacoes = l));
      this.insights.panoramaCampus(this.filtroCampus).subscribe({
        next: p => (this.panorama = p),
        error: () => (this.panorama = undefined)
      });
    } else {
      this.localizacoes = [];
      this.panorama = undefined;
    }
    this.buscar();
  }

  buscar(): void {
    this.carregando = true;
    this.catalogo.listarBanheiros({
      campusId: this.filtroCampus,
      localizacaoId: this.filtroLocalizacao,
      tipo: this.filtroTipo,
      acessivel: this.filtroAcessivel
    }).subscribe({
      next: b => {
        this.banheiros = b.filter(x => x.ativo !== false);
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
