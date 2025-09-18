import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../../interceptors/auth.interceptor';

describe('AuthInterceptor', () => {
  it('adds Authorization header when token present', () => {
    localStorage.setItem('auth_token', 'abc123');
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideHttpClient(withInterceptors([authInterceptor]))]
    });
    const http = TestBed.inject(HttpTestingController);
    const client = TestBed.inject<any>(Symbol.for('HttpClient') as any) || (TestBed as any).injector.get((window as any).ng.common.http.HttpClient);
    client.get('/test').subscribe();
    const req = http.expectOne('/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
    req.flush({});
    http.verify();
    localStorage.removeItem('auth_token');
  });
});