import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AppUser { id: number; email: string; role?: 'admin' | 'user'; }
interface AuthResponse { accessToken: string; user: AppUser; }

const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<AppUser | null>(this.restore());
  readonly userSig = this._user.asReadonly();

  constructor(private http: HttpClient) {}

  private restore(): AppUser | null {
    try { const raw = localStorage.getItem(USER_KEY); return raw ? JSON.parse(raw) as AppUser : null; }
    catch { return null; }
  }
  private save(token: string, user: AppUser) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._user.set(user);
  }

  user(): AppUser | null { return this._user(); }
  userId(): number | undefined { return this._user()?.id ?? undefined; }
  isLoggedIn(): boolean { return !!this._user(); }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
  }

  /** Простий реєстр: json-server-auth сам створить user і віддасть токен */
  register(email: string, password: string): Observable<void> {
    return this.http.post<AuthResponse>(`${environment.apiBase}/register`, { email, password, role: 'user' })
      .pipe(tap(res => this.save(res.accessToken, res.user)), map(() => void 0));
  }

  login(email: string, password: string): Observable<void> {
    return this.http.post<AuthResponse>(`${environment.apiBase}/login`, { email, password })
      .pipe(tap(res => this.save(res.accessToken, res.user)), map(() => void 0));
  }
}
