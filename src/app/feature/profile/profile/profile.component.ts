import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserService } from '../../../core/services/user/user.service';
import { UserResponse } from '../models/user-response.model';
import { Role } from '../models/user-role.enum';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgClass, RouterLink], // Add RouterLink here
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
    console.log('=== PROFILE COMPONENT INIT ===');

    // First load from auth service
    this.userSubscription = this.authService.user$
      .pipe(filter(response => !!response))
      .subscribe(response => {
        console.log('User from auth service:', response);
        this.user = response;

        // If team info is missing, refresh from server
        if (response && (!response.teamId || !response.teamName)) {
          console.log('Team info missing, refreshing from server...');
          this.refreshProfile();
        }
      });

    // Also refresh profile on init to ensure we have latest data
    this.refreshProfile();
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
    console.log('Refreshing profile from server...');
    this.loading = true;

    this.userService.getUserInfo().subscribe({
      next: (user) => {
        console.log('Fresh user data from server:', user);
        this.user = user;
        this.authService.setUser(user); // Update the auth service with fresh data
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to refresh profile:', error);
        this.loading = false;
      }
    });
  }

  // Debug method to check user data
  debugUserData(): void {
    console.log('=== USER DATA DEBUG ===');
    console.log('Current user:', this.user);
    console.log('Team ID:', this.user?.teamId);
    console.log('Team Name:', this.user?.teamName);
    console.log('Has team?', !!(this.user?.teamId && this.user?.teamName));
  }
}
