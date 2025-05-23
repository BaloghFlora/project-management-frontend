// feature/teams/teams.routes.ts
import { Routes } from '@angular/router';
import { ROUTES } from '../../core/config/routes.enum';
import { hasAuthorization } from '../../core/guards/authorization/authorization.guard';

export const routes: Routes = [
  {
    path: ROUTES.EMPTY,
    loadComponent: () => import('./teams/teams.component').then(m => m.TeamsComponent),
    canActivate: [ hasAuthorization ],
    data: {
      requiredRoles: [ 'ADMIN', 'MODERATOR' ]
    }
  },
  {
    path: ROUTES.LOGIN,
    loadComponent: () => import('./team/team.component').then(m => m.TeamComponent),
    canActivate: [ hasAuthorization ],
    data: {
      requiredRoles: [ 'ADMIN', 'MODERATOR' ],
      isSelf: true
    }
  },
  {
    path: ROUTES.ALL,
    redirectTo: ROUTES.EMPTY
  }
];
