import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTES } from '../../../core/config/routes.enum';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserService } from '../../../core/services/user/user.service';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [ FormsModule, ReactiveFormsModule ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage?: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required ] ]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = { ...this.loginForm.value };
    this.authService.login(credentials)
      .subscribe({
        next: () => this.getUserInfo(),
        error: (error: HttpErrorResponse) => this.errorMessage = error.error.message
      });
  }

  dismissError(): void {
    this.errorMessage = undefined;
  }

  private getUserInfo(): void {
    this.userService.getUserInfo().subscribe({
      next: (response) => {
        this.authService.setUser(response);
        this.router.navigateByUrl(ROUTES.EMPTY).then();
      },
      error: (error: HttpErrorResponse) => {
        this.authService.clearUser();
        this.errorMessage = error.error.message;
      }
    });
  }
}
