import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { UserResponse } from '../../../feature/profile/models/user-response.model';
import { Role } from '../../../feature/profile/models/user-role.enum';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit, OnDestroy {
  currentUser?: UserResponse;
  userSubscription?: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user$
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  get canAccessTeams(): boolean {
    return this.currentUser?.role === Role.ADMIN ||
      this.currentUser?.role === Role.PROJECT_MANAGER;
  }
}
