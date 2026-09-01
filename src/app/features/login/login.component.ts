import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, tap } from 'rxjs';

import { AuthService } from '../../core/auth/auth.services';
import { AuthStore } from '../../core/store/auth.store';
import { InputComponent } from '../../shared/components/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, InputComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false],
  });

  readonly isSubmitting = signal(false);
  readonly showPassword = signal(false);
  readonly errorMessage = signal<string | null>(null);

  get emailControl() {
    return this.form.controls.email;
  }

  get passwordControl() {
    return this.form.controls.password;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  submit(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    this.authService
      .login(this.form.getRawValue())
      .pipe(
        tap((response) => this.authStore.setSession(response)),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isSubmitting.set(false)),
      )
      .subscribe({
        next: () => void this.router.navigateByUrl(this.getSafeReturnUrl()),
        error: (error: HttpErrorResponse) => {
          this.errorMessage.set(this.toUserFriendlyMessage(error));
        },
      });
  }

  private getSafeReturnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    return returnUrl?.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/dashboard';
  }

  private toUserFriendlyMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Tidak dapat terhubung ke server. Periksa koneksi Anda.';
    }

    if (error.status === 400 || error.status === 401) {
      return 'Email atau password tidak sesuai.';
    }

    if (error.status === 429) {
      return 'Terlalu banyak percobaan login. Silakan coba beberapa saat lagi.';
    }

    return 'Login gagal. Silakan coba kembali.';
  }
}
