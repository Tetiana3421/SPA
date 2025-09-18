import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PetsService } from '../../../core/services/pets.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { map, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-pet-details',
  imports: [AsyncPipe, NgIf, RouterLink],
  template: `
    <ng-container *ngIf="pet$ | async as pet; else notFound">
      <h2>{{pet.name}}</h2>
      <p>Тип: {{pet.type}}</p>
      <p *ngIf="pet.age !== undefined">Вік: {{pet.age}} років</p>
      <p *ngIf="pet.weightKg !== undefined">Вага: {{pet.weightKg}} кг</p>
      <p *ngIf="pet.notes">Нотатки: {{pet.notes}}</p>
      <div style="display:flex; gap:8px;">
        <a class="btn" [routerLink]="['/pets', pet.id, 'edit']">Редагувати</a>
        <a class="btn secondary" routerLink="/pets">Назад</a>
      </div>
    </ng-container>
    <ng-template #notFound><p>Запис не знайдено.</p></ng-template>
  `
})
export class PetDetailsComponent {
  pet$ = this.route.paramMap.pipe(
    map(params => params.get('id')!),
    switchMap(id => this.pets.byId$(id))
  );
  constructor(private route: ActivatedRoute, private pets: PetsService) {}
}