import { Pipe, PipeTransform } from '@angular/core';
import { Breed } from '../../core/models/breed.model';

@Pipe({ name: 'breedName', standalone: true, pure: true })
export class BreedNamePipe implements PipeTransform {
  transform(id: string | undefined, breeds: Breed[]): string {
    return breeds.find(b => b.id === id)?.name ?? '—';
  }
}