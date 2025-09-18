import { Component } from '@angular/core';
import { BreedsService } from '../../../core/services/breeds.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { map, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-breed-details',
  imports: [AsyncPipe, NgIf],
  template: `
    <ng-container *ngIf="breed$ | async as breed">
      <h2>{{breed?.name}}</h2>
      <p>Вид: {{breed?.species}}</p>
      <p *ngIf="breed?.origin">Походження: {{breed?.origin}}</p>
      <img *ngIf="breed?.imageUrl" [src]="breed.imageUrl" alt="{{breed.name}}" style="width:100%;max-width:640px;border-radius:12px;">
      <p *ngIf="breed?.description" style="margin-top:12px">{{breed.description}}</p>
    </ng-container>
  `
})
export class BreedDetailsComponent {
  breed$ = this.route.paramMap.pipe(
    map(p => p.get('id')!),
    switchMap(id => this.breeds.byId$(id))
  );
  constructor(private route: ActivatedRoute, private breeds: BreedsService) {}
}