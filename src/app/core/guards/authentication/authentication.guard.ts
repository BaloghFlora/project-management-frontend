import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';


export const isAuthenticated: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const authenticated = route.data?.['authenticated'];
  const redirectUrl = route.data?.['redirectUrl'];

  // fetching the user sync won't work (authService.userSubject.value);
  return authService.userSubject.pipe(
    take(1),
    map(user => (authenticated === !!user ? true : router.parseUrl(redirectUrl)))
  );
};
