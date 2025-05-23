import { Routes } from '@angular/router';
import { ROUTES } from '../../core/config/routes.enum';


export const routes: Routes = [
  {
    path: ROUTES.EMPTY,
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: ROUTES.ALL,
    redirectTo: ROUTES.EMPTY
  }
];
