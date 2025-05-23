import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserService } from '../../../core/services/user/user.service';
import { UserResponse } from '../models/user-response.model';
import { Role } from '../models/user-role.enum';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgClass],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {

  user?: UserResponse;
  userSubscription?: Subscription;
  loading = false;

  // Expose Role enum to template
  protected readonly Role = Role;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user$
      .pipe(filter(response => !!response))
      .subscribe(response => {
        this.user = response;
      });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  getRoleDisplayName(role: Role): string {
    switch (role) {
      case Role.ADMIN:
        return 'Administrator';
      case Role.PROJECT_MANAGER:
        return 'Project Manager';
      case Role.TEAM_MEMBER:
        return 'Team Member';
      default:
        return 'Unknown Role';
    }
  }

  refreshProfile(): void {
    this.loading = true;
    this.userService.getUserInfo().subscribe({
      next: (user) => {
        this.authService.setUser(user);
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to refresh profile:', error);
        this.loading = false;
      }
    });
  }
}
