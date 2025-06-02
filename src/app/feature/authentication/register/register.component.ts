import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ROUTES } from '../../../core/config/routes.enum';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [FormsModule, ReactiveFormsModule, RouterLink]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage?: string;
  successMessage?: string;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword?.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }

    return null;
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = undefined;
    this.successMessage = undefined;

    const userData = { ...this.registerForm.value };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Registration successful! You can now log in.';

        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigateByUrl(`/${ROUTES.AUTH}/${ROUTES.LOGIN}`).then();
        }, 2000);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = error.error.message || 'Registration failed. Please try again.';
      }
    });
  }

  dismissError(): void {
    this.errorMessage = undefined;
  }

  dismissSuccess(): void {
    this.successMessage = undefined;
  }
}
