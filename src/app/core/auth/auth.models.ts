export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface KaryawanLoginData {
  token: string;
  tipe: string;
  roles: string[];
}

export type KaryawanLoginResponse = ApiResponse<KaryawanLoginData>;

export interface AuthUser {
  username: string;
  roles: string[];
  tipe: string;
}
