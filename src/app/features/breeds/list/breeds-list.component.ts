import { Component } from '@angular/core';
import { BreedsService } from '../../../core/services/breeds.service';
import { AsyncPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, map, startWith } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-breeds-list',
  imports: [NgFor, NgIf, AsyncPipe, TitleCasePipe, RouterLink, ReactiveFormsModule],
  template: `
    <div class="toolbar">
      <h2>Породи</h2>
    </div>

    <div class="form-row" style="margin:12px 0; display:flex; gap:8px;">
      <input class="input" [formControl]="q" placeholder="Пошук породи...">
      <select class="input" [formControl]="species">
        <option value="">Усі</option>
        <option value="dog">Собаки</option>
        <option value="cat">Коти</option>
      </select>
    </div>

    <ng-container *ngIf="vm$ | async as list; else loading">
      <div *ngIf="list.length; else empty" class="grid">
        <a class="card" *ngFor="let b of list" [routerLink]="['/breeds', b.id]">
          <img *ngIf="b.imageUrl" [src]="b.imageUrl" alt="" style="width:100%; height:140px; object-fit:cover; border-radius:8px;">
          <div style="padding:8px;">
            <h3 style="margin:0 0 4px 0;">{{ b.name }}</h3>
            <p style="margin:0; opacity:.75;">{{ b.species | titlecase }} · {{ b.origin || '—' }}</p>
          </div>
        </a>
      </div>
    </ng-container>

    <ng-template #loading><p>Завантаження...</p></ng-template>
    <ng-template #empty><p>Нічого не знайдено.</p></ng-template>
  `,
  styles: [`
    .card {
      display:block;
      border-radius:12px;
      overflow:hidden;
      text-decoration:none;     /* прибрали вигляд посилання */
      background:#1e293b;       /* темний фон */
      color:#fff;               /* білий текст */
      transition: transform .15s ease, box-shadow .15s ease;
      box-shadow:0 14px 32px rgba(2,6,23,.12);
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow:0 16px 36px rgba(2,6,23,.18);
    }
    img {
      width:100%;
      height:160px;
      object-fit:cover;
      display:block;
    }
    .body { padding:10px; }
    h3 { margin:0 0 4px 0; font-size:16px; color:#fff; }
    p { margin:0; opacity:.85; font-size:14px; color:#f1f5f9; }
    @media (max-width:599px) { img { height:120px; } }
    
  `]
})
export class BreedsListComponent {
  q = new FormControl<string>('', { nonNullable: true });
  species = new FormControl<string>('', { nonNullable: true });

  vm$ = combineLatest([
    this.breeds.list$(),
    this.q.valueChanges.pipe(startWith('')),
    this.species.valueChanges.pipe(startWith(''))
  ]).pipe(
    map(([arr, q, s]) => {
      const qq = (q || '').trim().toLowerCase();
      const ss = (s || '').trim().toLowerCase();
      return arr.filter(b =>
        (!qq || b.name.toLowerCase().includes(qq)) &&
        (!ss || b.species === ss)
      );
    })
  );

  constructor(private breeds: BreedsService) {}
}
