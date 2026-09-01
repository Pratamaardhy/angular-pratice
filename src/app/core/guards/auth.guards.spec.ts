import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authGuard } from './auth.guards';
import { AuthStore } from '../store/auth.store';

describe('authGuard (Unit Test)', () => {
  let authStoreMock: { isAuthenticated: ReturnType<typeof vi.fn> };
  let routerMock: { createUrlTree: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    // 1. Arrange Mock Dependency
    authStoreMock = { isAuthenticated: vi.fn() };
    routerMock = { createUrlTree: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStore, useValue: authStoreMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  // POSITIVE TEST CASE
  it('harus mengizinkan akses (mengembalikan true) jika user sudah terautentikasi', () => {
    // Arrange
    authStoreMock.isAuthenticated.mockReturnValue(true);

    // Act
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    // Assert
    expect(result).toBe(true);
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  // NEGATIVE TEST CASE
  it('harus menolak akses dan mengarahkan ke halaman /login jika user belum login', () => {
    // Arrange
    const fakeUrlTree = {} as UrlTree;
    authStoreMock.isAuthenticated.mockReturnValue(false);
    routerMock.createUrlTree.mockReturnValue(fakeUrlTree);

    // Act
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    // Assert
    expect(result).toBe(fakeUrlTree);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: undefined },
    });
  });
});
