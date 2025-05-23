import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserResponse } from '../models/user-response.model';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {

  user?: UserResponse;
  userSubscription?: Subscription;
  birthDate?: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user$
      .pipe(filter(response => !!response))
      .subscribe(response => {
        this.user = response;
        this.birthDate = new Date(response.birthDate).toISOString().split('T')[0];
      });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
