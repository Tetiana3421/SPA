import { Component, OnInit } from '@angular/core';
import { PetsService } from '../../../core/services/pets.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { PetCardComponent } from '../../../shared/components/pet-card/pet-card.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-pets-list',
  imports: [NgFor, AsyncPipe, ReactiveFormsModule, PetCardComponent, NgIf, RouterLink],
  template: `
    <div class="toolbar">
      <h2>Список тварин</h2>
      <a *ngIf="auth.isLoggedIn()" class="btn" routerLink="/pets/create">Додати</a>
    </div>

    <div class="form-row" style="margin:12px 0;">
      <input [formControl]="searchCtrl" class="input" placeholder="Пошук за ім’ям...">
    </div>

    <ng-container *ngIf="pets$ | async as pets; else loading">
      <div *ngIf="pets.length; else empty" class="grid">
        <app-pet-card *ngFor="let p of pets" [pet]="p"></app-pet-card>
      </div>
    </ng-container>

    <ng-template #loading><p>Завантаження...</p></ng-template>
    <ng-template #empty><p>Нічого не знайдено.</p></ng-template>
  `,
  styles: [`
    .toolbar { display:flex; align-items:center; justify-content:space-between; gap:12px; }
    .grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(240px,1fr)); gap:12px; }
  `]
})
export class PetsListComponent implements OnInit {
  searchCtrl = new FormControl<string>('', { nonNullable: true });

  // Завантажуємо весь список один раз і фільтруємо на клієнті
  pets$ = combineLatest([
    this.petsService.list$(),
    this.searchCtrl.valueChanges.pipe(startWith(''), debounceTime(250), distinctUntilChanged())
  ]).pipe(
    map(([pets, search]) => {
      const q = (search || '').trim().toLowerCase();
      return (pets ?? []).filter(p => !q || p.name.toLowerCase().includes(q));
    })
  );

  constructor(private petsService: PetsService, public auth: AuthService) {}

  ngOnInit(): void {}
}
