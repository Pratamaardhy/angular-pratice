import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IS_PUBLIC_API } from '../tokens/http-context.token';
import { KaryawanLoginResponse, LoginRequest } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  login(request: LoginRequest): Observable<KaryawanLoginResponse> {
    return this.http.post<KaryawanLoginResponse>(
      `${this.baseUrl}/api/auth/karyawan/login`,
      {
        username: request.email,
        password: request.password,
      },
      {
        // Tandai sebagai Public API agar interceptor tidak menambahkan header Authorization
        context: new HttpContext().set(IS_PUBLIC_API, true),
      },
    );
  }
}
