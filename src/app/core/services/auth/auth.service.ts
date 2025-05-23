import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginRequest } from '../../../feature/authentication/models/login-request.model';
import { UserResponse } from '../../../feature/profile/models/user-response.model';
import { ROUTES } from '../../config/routes.enum';
import { isLocalStorageAvailable } from '../../utils/storage-utils';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  public userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  public user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userSubject.next(this.getUserFromStorage());
  }

  login(credentials: LoginRequest): Observable<void> {
    return this.http.post<void>(`/v1/${ROUTES.AUTH}/${ROUTES.LOGIN}`, credentials);
  }

  logout(): void {
    this.clearUser();
    this.router.navigateByUrl(ROUTES.AUTH).then();
  }

  setUser(user: UserResponse) {
    if (isLocalStorageAvailable()) {
      localStorage.setItem('loggedUser', JSON.stringify(user));
    }
    this.userSubject.next(user);
  }

  clearUser(): void {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem('loggedUser');
    }
    this.clearCookies();
    this.userSubject.next(null);
  }

  private getUserFromStorage() {
    return isLocalStorageAvailable()
      ? JSON.parse(localStorage.getItem('loggedUser') || 'null')
      : null;
  }

  // cookieService.delete('jwt-token') doesn't work 100%
  private clearCookies(): void {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const equalPos = cookie.indexOf('=');
      const name = equalPos > -1 ? cookie.slice(0, equalPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
    }
  }
}
