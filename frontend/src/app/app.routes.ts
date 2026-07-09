import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { BanheiroDetalheComponent } from './pages/banheiro-detalhe/banheiro-detalhe.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { AdminComponent } from './pages/admin/admin.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { adminGuard, authGuard } from './core/guards';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'banheiros/:id', component: BanheiroDetalheComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
