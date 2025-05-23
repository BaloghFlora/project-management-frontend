import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ROUTES } from '../../config/routes.enum';
import { AuthService } from '../../services/auth/auth.service';
import { Role } from '../../../feature/profile/models/user-role.enum';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {

  protected readonly ROUTES = ROUTES;
  protected readonly REQUIRED_ROLES = [Role.ADMIN, Role.PROJECT_MANAGER];

  hasTeamTablePermission: boolean = false;
  userSubscription?: Subscription;
  userName?: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user$
      .subscribe(response => {
        if (response) {
          this.hasTeamTablePermission = this.REQUIRED_ROLES.includes(response.role);
          this.userName = response.name;
        } else {
          this.hasTeamTablePermission = false;
          this.userName = undefined;
        }
      });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}
