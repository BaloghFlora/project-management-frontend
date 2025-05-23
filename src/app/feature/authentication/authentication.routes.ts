import { Routes } from '@angular/router';
import { ROUTES } from '../../core/config/routes.enum';


export const routes: Routes = [
  {
    path: ROUTES.LOGIN,
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: ROUTES.ALL,
    redirectTo: ROUTES.LOGIN
  }
];
