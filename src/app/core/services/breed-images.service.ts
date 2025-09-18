import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BreedImagesService {
  private http = inject(HttpClient);

  private headers(apiKey?: string) {
    return apiKey ? new HttpHeaders({ 'x-api-key': apiKey }) : undefined;
  }

  /** Повертає одне фото для породи собаки за breedId (TheDogAPI breed id або name). */
  dogImage$(breedQuery: string): Observable<string | null> {
    const params = new HttpParams().set('limit', 1).set('breed_ids', breedQuery); // breed_ids — ID з TheDogAPI
    return this.http.get<any[]>(
      `${environment.theDogApi.base}/images/search`,
      { headers: this.headers(environment.theDogApi.apiKey), params }
    ).pipe(map(arr => arr?.[0]?.url ?? null));
  }

  /** Повертає одне фото для породи кота за breedId (TheCatAPI breed id або name). */
  catImage$(breedQuery: string): Observable<string | null> {
    const params = new HttpParams().set('limit', 1).set('breed_ids', breedQuery);
    return this.http.get<any[]>(
      `${environment.theCatApi.base}/images/search`,
      { headers: this.headers(environment.theCatApi.apiKey), params }
    ).pipe(map(arr => arr?.[0]?.url ?? null));
  }

  /** Якщо не знаємо breed_id у зовнішньому API — спершу шукаємо його по name. */
  findDogBreedIdByName$(name: string): Observable<string | null> {
    return this.http.get<any[]>(
      `${environment.theDogApi.base}/breeds/search`,
      { headers: this.headers(environment.theDogApi.apiKey), params: new HttpParams().set('q', name) }
    ).pipe(map(list => list?.[0]?.id?.toString() ?? null));
  }

  findCatBreedIdByName$(name: string): Observable<string | null> {
    return this.http.get<any[]>(
      `${environment.theCatApi.base}/breeds/search`,
      { headers: this.headers(environment.theCatApi.apiKey), params: new HttpParams().set('q', name) }
    ).pipe(map(list => list?.[0]?.id ?? null));
  }

  /** Рандомне фото, якщо нічого не знайшли */
  randomDog$(): Observable<string> {
    return this.http.get<any[]>(
      `${environment.theDogApi.base}/images/search`,
      { headers: this.headers(environment.theDogApi.apiKey), params: new HttpParams().set('limit', 1) }
    ).pipe(map(a => a?.[0]?.url));
  }

  randomCat$(): Observable<string> {
    return this.http.get<any[]>(
      `${environment.theCatApi.base}/images/search`,
      { headers: this.headers(environment.theCatApi.apiKey), params: new HttpParams().set('limit', 1) }
    ).pipe(map(a => a?.[0]?.url));
  }
}
