import { Routes } from '@angular/router';
import { ROUTES } from './core/config/routes.enum';
import { isAuthenticated } from './core/guards/authentication/authentication.guard';


export const routes: Routes = [
  {
    path: ROUTES.EMPTY,
    loadComponent: () => import('./core/components/home/home.component').then(m => m.HomeComponent),
    canActivate: [ isAuthenticated ],
    data: {
      authenticated: true,
      redirectUrl: ROUTES.AUTH
    }
  },
  {
    path: ROUTES.AUTH,
    loadChildren: () => import('./feature/authentication/authentication.routes').then(m => m.routes),
    canActivate: [ isAuthenticated ],
    data: {
      authenticated: false,
      redirectUrl: ROUTES.TEAMS
    }
  },
  {
    path: ROUTES.TEAMS,
    loadChildren: () => import('./feature/teams/teams.routes').then(m => m.routes),
    canActivate: [ isAuthenticated ],
    data: {
      authenticated: true,
      redirectUrl: ROUTES.AUTH
    }
  },
  {
    path: ROUTES.PROFILE,
    loadChildren: () => import('./feature/profile/profile.routes').then(m => m.routes),
    canActivate: [ isAuthenticated ],
    data: {
      authenticated: true,
      redirectUrl: ROUTES.AUTH
    }
  },
  {
    path: ROUTES.ABOUT,
    loadComponent: () => import('./core/components/about/about.component').then(m => m.AboutComponent),
    canActivate: [ isAuthenticated ],
    data: {
      authenticated: true,
      redirectUrl: ROUTES.AUTH
    }
  },
  {
    path: ROUTES.NOT_FOUND,
    loadComponent: () => import('./core/components/not-found/not-found.component').then(m => m.NotFoundComponent),
    canActivate: [ isAuthenticated ],
    data: {
      authenticated: true,
      redirectUrl: ROUTES.AUTH
    }
  },
  {
    path: ROUTES.FORBIDDEN,
    loadComponent: () => import('./core/components/forbidden/forbidden.component').then(m => m.ForbiddenComponent),
    canActivate: [ isAuthenticated ],
    data: {
      authenticated: true,
      redirectUrl: ROUTES.AUTH
    }
  },
  {
    path: ROUTES.ALL,
    redirectTo: ROUTES.NOT_FOUND
  }
];
