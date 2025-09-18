import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, of, timeout } from 'rxjs';

export interface BreedVM {
  id: string;
  name: string;
  species: 'cat' | 'dog';
  origin?: string;
  description?: string;
  imageUrl?: string;
}

const DOG_FALLBACK: BreedVM[] = [
  'beagle','boxer','bulldog','chihuahua','corgi','dachshund','doberman','germanshepherd',
  'goldenretriever','husky','labrador','malamute','poodle','pug','rottweiler','shihtzu','terrier'
].map(n => ({
  id: `dog-${n}`,
  name: n.charAt(0).toUpperCase() + n.slice(1),
  species: 'dog' as const
}));

@Injectable({ providedIn: 'root' })
export class BreedsService {
  constructor(private http: HttpClient) {}

  list$() {
    // Dogs (публічне API) -> фолбек на статичний список
    const dogs$ = this.http.get<{ message: Record<string, string[]> }>('https://dog.ceo/api/breeds/list/all')
      .pipe(
        timeout(4000),
        map(res => Object.keys(res.message || {})),
        map(names => names.map<BreedVM>(n => ({
          id: `dog-${n}`,
          name: n.charAt(0).toUpperCase() + n.slice(1),
          species: 'dog'
        }))),
        catchError(() => of(DOG_FALLBACK)) // головне: не падати UI
      );

    // Cats (TheCatAPI) -> м’який таймаут + дефолт []
    const cats$ = this.http.get<any[]>('https://api.thecatapi.com/v1/breeds')
      .pipe(
        timeout(4000),
        map(items => (items || []).map<BreedVM>(b => ({
          id: `cat-${b.id}`,
          name: b.name,
          species: 'cat',
          origin: b.origin,
          description: b.temperament,
          imageUrl: b.image?.url
        }))),
        catchError(() => of<BreedVM[]>([]))
      );

    return forkJoin([dogs$, cats$]).pipe(
      map(([dogs, cats]) => [...dogs, ...cats])
    );
  }

  byId$(rawId: string) {
    if (rawId.startsWith('dog-')) {
      const name = rawId.replace(/^dog-/, '');
      // пробуємо API, інакше шукаємо у фолбек-списку
      return this.http.get<{ message: Record<string, string[]> }>('https://dog.ceo/api/breeds/list/all')
        .pipe(
          timeout(4000),
          map(res => Object.keys(res.message || {})),
          map(names => names.includes(name)
            ? ({ id: `dog-${name}`, name: name.charAt(0).toUpperCase() + name.slice(1), species: 'dog' as const })
            : undefined),
          catchError(() => of(DOG_FALLBACK.find(d => d.id === `dog-${name}`)))
        );
    } else {
      const cid = rawId.replace(/^cat-/, '');
      return this.http.get<any[]>('https://api.thecatapi.com/v1/breeds')
        .pipe(
          timeout(4000),
          map(items => items.find(x => String(x.id) === cid)),
          map(b => b ? ({
            id: `cat-${b.id}`,
            name: b.name,
            species: 'cat' as const,
            origin: b.origin,
            description: b.temperament,
            imageUrl: b.image?.url
          }) : undefined),
          catchError(() => of(undefined))
        );
    }
  }
}
