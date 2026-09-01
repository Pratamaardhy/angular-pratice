import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoanApplication {
  id: number;
  nomorPengajuan: string;
  namaNasabah: string;
  nominal: number;
  tenor: number;
  status: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class LoanApplicationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  // Protected API: Tidak perlu kirim context IS_PUBLIC_API (default: protected)
  // AuthInterceptor secara otomatis menyisipkan Authorization: Bearer <token>
  getDaftarPengajuan(): Observable<ApiResponse<LoanApplication[]>> {
    return this.http.get<ApiResponse<LoanApplication[]>>(`${this.baseUrl}/api/pengajuan-pinjaman`);
  }
}
