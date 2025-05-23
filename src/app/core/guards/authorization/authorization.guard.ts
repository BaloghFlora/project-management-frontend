import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { ROUTES } from '../../config/routes.enum';
import { AuthService } from '../../services/auth/auth.service';


export const hasAuthorization: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const requiredRoles = route.data?.['requiredRoles'] ?? [];
  const isSelf = route.data?.['isSelf'] ?? false;
  const userIdFromParams = route.params['id'];

  // fetching the user sync won't work (authService.userSubject.value);
  return authService.userSubject.pipe(
    take(1),
    map(user => (requiredRoles.includes(user?.role) || (isSelf && user?.id === userIdFromParams) ? true : router.parseUrl(ROUTES.FORBIDDEN)))
  );
};
