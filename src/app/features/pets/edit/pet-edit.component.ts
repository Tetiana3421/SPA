import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PetsService } from '../../../core/services/pets.service';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-pet-edit',
  imports: [ReactiveFormsModule, NgIf],
  template: `
    <h2>Редагувати тварину</h2>
    <form *ngIf="loaded" [formGroup]="form" (ngSubmit)="onSubmit()" class="card">
      <label>Ім’я</label>
      <input class="input" formControlName="name">
      <label>Нотатки</label>
      <textarea class="input" formControlName="notes"></textarea>
      <button class="btn" type="submit" [disabled]="form.invalid">Оновити</button>
    </form>
  `
})
export class PetEditComponent implements OnInit {
  id!: string;
  loaded = false;
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    notes: ['']
  });

  constructor(private fb: FormBuilder, private pets: PetsService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.pets.byId$(this.id).subscribe(p => {
      this.form.patchValue({ name: p.name, notes: p.notes || '' });
      this.loaded = true;
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.pets.update$(this.id, this.form.value as any).subscribe(() => this.router.navigate(['/pets', this.id]));
  }
}