import { Routes } from '@angular/router';
import { ROUTES } from '../../core/config/routes.enum';
import { hasAuthorization } from '../../core/guards/authorization/authorization.guard';

export const routes: Routes = [
  {
    path: ROUTES.EMPTY,
    loadComponent: () => import('./teams/teams.component').then(m => m.TeamsComponent),
    canActivate: [ hasAuthorization ],
    data: {
      requiredRoles: [ 'ADMIN', 'PROJECT_MANAGER' ]
    }
  },
  {
    path: ':id',
    loadComponent: () => import('./team/team.component').then(m => m.TeamComponent),
    canActivate: [ hasAuthorization ],
    data: {
      requiredRoles: [ 'ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER' ],
      isSelf: false
    }
  },
  {
    path: ROUTES.ALL,
    redirectTo: ROUTES.EMPTY
  }
];
