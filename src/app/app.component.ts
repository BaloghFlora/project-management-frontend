import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { AuthService } from './core/services/auth/auth.service';
import { ModalService } from './core/services/modal/modal.service';
import { ModalComponent } from './shared/components/modal/modal.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    NavbarComponent,
    RouterOutlet,
    ModalComponent
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  title: string = 'photo-mgmt-frontend';
  loggedIn: boolean = false;
  userSubscription?: Subscription;

  constructor(
    protected modalService: ModalService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user$
      .subscribe(response => this.loggedIn = !!response);
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
