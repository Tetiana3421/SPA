import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NgIf } from '@angular/common'; // ⬅ добавили

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf], // ⬅ добавили NgIf
  template: `
    <h2>Увійти</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="card">
      <label>Email</label>
      <input class="input" formControlName="email" type="email">
      <label>Пароль</label>
      <input class="input" formControlName="password" type="password">
      <button class="btn" type="submit" [disabled]="form.invalid || loading">Увійти</button>
      <div class="error" *ngIf="error">{{error}}</div>
    </form>
  `
})
export class LoginComponent {
  error: string | null = null;
  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit() {
    if (this.form.invalid) return;
    this.error = null; this.loading = true;
    const { email, password } = this.form.value as { email: string; password: string };
    this.auth.login(email, password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/pets';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
  const msg = err?.error?.message || 'Невірний email або пароль';
  this.error = (msg === 'Cannot find user' || msg === 'Incorrect password')
    ? 'Невірний email або пароль'
    : msg;
  this.loading = false;
}

    });
  }
}
