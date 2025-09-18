import { Component, Input } from '@angular/core';
import { Pet } from '../../../core/models/pet.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="card">
      <img *ngIf="pet.photoUrl" [src]="pet.photoUrl" alt="{{pet.name}}" style="width:100%;height:160px;object-fit:cover;border-radius:8px;">
      <h3>{{pet.name}}</h3>
      <p>Тип: {{pet.type}}</p>
      <a [routerLink]="['/pets', pet.id]" class="btn">Деталі</a>
    </div>
  `
})
export class PetCardComponent {
  @Input({ required: true }) pet!: Pet;
}