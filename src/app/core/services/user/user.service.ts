import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from '../../../feature/profile/models/user-response.model';
import { ROUTES } from '../../config/routes.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserInfo(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`/v1/${ROUTES.USERS}/info`);
  }

  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`/v1/${ROUTES.USERS}/${id}`);
  }
}
