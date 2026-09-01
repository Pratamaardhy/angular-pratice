import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  const executeInterceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('harus meneruskan request HTTP', () => {
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = () => of(new HttpResponse({ status: 200 }));

    executeInterceptor(req, next).subscribe((response) => {
      expect(response).toBeTruthy();
    });
  });
});
