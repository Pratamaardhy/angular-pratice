import { AuthUser, LoginRequest } from './auth.models';

describe('AuthModels Interface Validation', () => {
  it('harus membuat objek LoginRequest yang valid', () => {
    const payload: LoginRequest = {
      email: 'ardi@bcaf.co.id',
      password: 'password123',
      rememberMe: true,
    };

    expect(payload.email).toBe('ardi@bcaf.co.id');
    expect(payload.rememberMe).toBe(true);
  });

  it('harus membuat objek AuthUser yang valid', () => {
    const user: AuthUser = {
      username: 'Ardi',
      roles: ['MARKETING'],
      tipe: 'KARYAWAN',
    };

    expect(user.roles).toContain('MARKETING');
  });
});
