import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

interface User { id: number; email: string; role?: 'admin'|'user'; }

@Component({
  standalone: true,
  selector: 'app-users',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Користувачі</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="card" style="max-width:480px;">
      <label>Email</label>
      <input class="input" formControlName="email" type="email">
      <label>Пароль</label>
      <input class="input" formControlName="password" type="password">
      <label>Роль</label>
      <select class="input" formControlName="role">
        <option value="user">user</option>
        <option value="admin">admin</option>
      </select>
      <button class="btn" type="submit" [disabled]="form.invalid">Додати користувача</button>
    </form>

    <h3>Список</h3>
    <ul>
      <li *ngFor="let u of users">{{u.email}} <strong *ngIf="u.role==='admin'">(admin)</strong></li>
    </ul>
  `
})
export class UsersComponent {
  users: User[] = [];
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['user', Validators.required]
  });

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.load();
  }

  load() {
    this.http.get<User[]>(`${environment.apiBase}/users`).subscribe(u => this.users = u);
  }

  onSubmit() {
    const { email, password, role } = this.form.value as any;
    this.http.post(`${environment.apiBase}/register`, { email, password, role }).subscribe(() => {
      this.form.reset({ role: 'user' });
      this.load();
    });
  }
}