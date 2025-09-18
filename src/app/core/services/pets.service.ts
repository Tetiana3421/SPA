import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, forkJoin, map } from 'rxjs';

export interface CatalogPet {
  id: string;
  name: string;
  species: 'dog'|'cat';
  origin?: string;
  description?: string;
  imageUrl?: string;
  breed?: string;
}

export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'other';
  breedId?: string | null;
  age?: number | null;
  weightKg?: number | null;
  userId?: number | null;
  createdAt?: number;
  imageUrl?: string;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class PetsService {
  constructor(private http: HttpClient) {}

  // === КАТАЛОГ ИЗ ПУБЛИЧНЫХ API ===
  catalog$(): Observable<CatalogPet[]> {
    const dogs$ = this.http.get<any[]>('https://api.thedogapi.com/v1/breeds').pipe(
      map(items => items.map(b => ({
        id: `dog-${b.id}`,
        name: b.name,
        species: 'dog' as const,
        origin: b.origin,
        description: b.temperament,
        imageUrl: b.image?.url,
        breed: b.name
      })))
    );
    const cats$ = this.http.get<any[]>('https://api.thecatapi.com/v1/breeds').pipe(
      map(items => items.map(b => ({
        id: `cat-${b.id}`,
        name: b.name,
        species: 'cat' as const,
        origin: b.origin,
        description: b.temperament,
        imageUrl: b.image?.url,
        breed: b.name
      })))
    );
    return forkJoin([dogs$, cats$]).pipe(map(([dogs, cats]) => [...dogs, ...cats]));
  }

  // === ВАШИ CRUD МЕТОДЫ (пример) ===
  list$(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${environment.apiBase}/pets`);
  }
  byId$(id: string): Observable<Pet> {
    return this.http.get<Pet>(`${environment.apiBase}/pets/${id}`);
  }
  create$(payload: Pet): Observable<Pet> {
    return this.http.post<Pet>(`${environment.apiBase}/pets`, payload);
  }
  update$(id: string, payload: Partial<Pet>): Observable<Pet> {
    return this.http.patch<Pet>(`${environment.apiBase}/pets/${id}`, payload);
  }
  delete$(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBase}/pets/${id}`);
  }
}
