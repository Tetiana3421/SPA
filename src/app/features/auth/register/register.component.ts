import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgIf],
  template: `
    <h2>Реєстрація</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="card">
      <div class="form-row">
        <label>Email</label>
        <input class="input" formControlName="email" type="email" placeholder="you@example.com">
      </div>

      <div class="form-row">
        <label>Пароль</label>
        <input class="input" formControlName="password" type="password" placeholder="мін. 6 символів">
      </div>

      <button class="btn" type="submit" [disabled]="form.invalid || loading">
        {{ loading ? 'Створюємо...' : 'Створити акаунт' }}
      </button>

      <p class="error" *ngIf="error">{{ error }}</p>
    </form>
  `
})
export class RegisterComponent {
  error: string | null = null;
  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.form.invalid || this.loading) return;

    this.error = null;
    this.loading = true;

    const { email, password } = this.form.value as { email: string; password: string };

    // УВАЖНО: тепер register() одразу створює користувача і логінить
    this.auth.register(email, password).subscribe({
      next: () => this.router.navigateByUrl('/pets'),
      error: (err) => {
        const msg = err?.error?.message || 'Не вдалося створити акаунт';
        this.error = (msg === 'Email already exists')
          ? 'Користувач з таким email вже існує'
          : msg;
        this.loading = false;
      }
    });
  }
}
