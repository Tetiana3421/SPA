import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PetsService } from '../../../core/services/pets.service';
import { AuthService } from '../../../core/services/auth.service';
import { HighlightInvalidDirective } from '../../../shared/directives/highlight-invalid.directive';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-pet-create',
  imports: [ReactiveFormsModule, HighlightInvalidDirective, NgIf],
  template: `
    <h2>Додати тварину</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="card">
      <div class="form-row">
        <label>Ім’я</label>
        <input highlightInvalid class="input" formControlName="name" placeholder="Напр., Бублик">
        <small *ngIf="form.controls.name.touched && form.controls.name.invalid" class="err">
          Мін. довжина — 2 символи
        </small>
      </div>

      <div class="form-row">
        <label>Тип</label>
        <select class="input" formControlName="type">
          <option value="cat">Кіт/Кішка</option>
          <option value="dog">Пес/Собака</option>
          <option value="other">Інше</option>
        </select>
      </div>

      <div class="form-row">
        <label>Вік</label>
        <input class="input" type="number" formControlName="age" placeholder="Роки">
      </div>

      <div class="form-row">
        <label>Вага, кг</label>
        <input class="input" type="number" formControlName="weightKg" placeholder="кг">
      </div>

      <div class="form-row">
        <label>Нотатки</label>
        <textarea class="input" formControlName="notes" rows="3"></textarea>
      </div>

      <div class="form-row" style="display:flex; gap:8px;">
        <button class="btn" type="submit" [disabled]="form.invalid">Зберегти</button>
        <a class="btn secondary" routerLink="/pets">Скасувати</a>
      </div>
    </form>
  `,
  styles: [`.err{color:crimson;font-size:12px}`]
})
export class PetCreateComponent {
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    type: ['cat', Validators.required],
    age: [null as number | null, [Validators.min(0), Validators.max(40)]],
    weightKg: [null as number | null, [Validators.min(0)]],
    notes: ['']
  });

  constructor(private fb: FormBuilder, private pets: PetsService, private router: Router, private auth: AuthService) {}

  onSubmit() {
    if (this.form.invalid) return;
    const payload = {
      ...(this.form.value as any),
      userId: this.auth.userId() // json-server-auth поле власника
    };
    this.pets.create$(payload).subscribe(() => this.router.navigate(['/pets']));
  }
}
