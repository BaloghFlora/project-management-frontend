import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment.development';


export const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({
    url: getUrl(req.url),
    headers: getHeaders(),
    withCredentials: true,
  });

  return next(modifiedReq);
};

const getUrl = (url: string): string => {
  return `${environment.baseUrl}${url}`;
};

const getHeaders = (): HttpHeaders => {
  const cookieService = inject(CookieService);
  const jwtToken = cookieService.get('jwt-token');

  return jwtToken !== ''
    ? new HttpHeaders({ 'Authorization': `Bearer ${jwtToken}` })
    : new HttpHeaders();
};
