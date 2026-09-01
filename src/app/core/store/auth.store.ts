import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { AuthUser, KaryawanLoginResponse } from '../auth/auth.models';

interface AuthState {
  accessToken: string | null;
  currentUser: AuthUser | null;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Ambil token langsung dari storage saat aplikasi/store pertama kali dimuat
  private readonly state = signal<AuthState>({
    accessToken: this.getSavedToken(),
    currentUser: null,
  });

  readonly accessToken = computed(() => this.state().accessToken);
  readonly currentUser = computed(() => this.state().currentUser);
  readonly isAuthenticated = computed(() => !!this.state().accessToken);

  private getSavedToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  setSession(response: KaryawanLoginResponse): void {
    const loginData = response.data;

    if (this.isBrowser) {
      localStorage.setItem('access_token', loginData.token);
    }

    this.state.set({
      accessToken: loginData.token,
      currentUser: {
        username: '',
        roles: loginData.roles,
        tipe: loginData.tipe,
      },
    });
  }

  clearSession(): void {
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
    }
    this.state.set({
      accessToken: null,
      currentUser: null,
    });
  }
}
