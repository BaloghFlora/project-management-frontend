import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ROUTES } from '../../config/routes.enum';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {

  protected readonly ROUTES = ROUTES;
  protected readonly REQUIRED_ROLES = ['ADMIN', 'PROJECT_MANAGER'];

  hasTeamPermission: boolean = false;
  userSubscription?: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user$
      .subscribe(response => this.hasTeamPermission = this.REQUIRED_ROLES.includes(response?.role));
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}
