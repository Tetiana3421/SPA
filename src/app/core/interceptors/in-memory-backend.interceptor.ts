import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Pet } from '../models/pet.model';

type DB = { pets: Pet[] };

function getDB(): DB {
  const raw = localStorage.getItem('pets_db');
  if (raw) return JSON.parse(raw) as DB;
  const seed: DB = {
    pets: [
      { id:'p1', name:'Рекс', type:'dog', breedId: undefined, age:3, weightKg:18, userId: undefined, createdAt: Date.now()-86400000, notes:'Любить м’яч' },
      { id:'p2', name:'Мурка', type:'cat', breedId: undefined, age:2, weightKg:4,  userId: undefined, createdAt: Date.now()-43200000, notes:'Спить на сонці' }
    ]
  };
  localStorage.setItem('pets_db', JSON.stringify(seed));
  return seed;
}

function saveDB(db: DB) {
  localStorage.setItem('pets_db', JSON.stringify(db));
}

export const inMemoryBackendInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  if (!req.url.startsWith('/api/')) {
    return next(req);
  }

  const db = getDB();

  // GET /api/pets?search=...
  if (req.method === 'GET' && req.url.startsWith('/api/pets')) {
    const url = new URL(req.url, location.origin);
    const search = (url.searchParams.get('search') || '').toLowerCase();
    const list = db.pets
      .filter(p => !search || p.name.toLowerCase().includes(search));
    return of(new HttpResponse({ status: 200, body: list }));
  }

  // GET /api/pets/:id
  if (req.method === 'GET' && /^\/api\/pets\/[^/]+$/.test(req.url)) {
    const id = req.url.split('/').pop()!;
    const found = db.pets.find(p => p.id === id);
    return of(new HttpResponse({ status: found ? 200 : 404, body: found || null }));
  }

  // POST /api/pets
  if (req.method === 'POST' && req.url === '/api/pets') {
    const body = req.body as Omit<Pet, 'id'|'createdAt'>;
    const pet: Pet = { ...body, id: 'p' + Math.random().toString(36).slice(2, 9), createdAt: Date.now() };
    db.pets.unshift(pet);
    saveDB(db);
    return of(new HttpResponse({ status: 201, body: pet }));
  }

  // PATCH /api/pets/:id
  if (req.method === 'PATCH' && /^\/api\/pets\/[^/]+$/.test(req.url)) {
    const id = req.url.split('/').pop()!;
    const idx = db.pets.findIndex(p => p.id === id);
    if (idx === -1) return of(new HttpResponse({ status: 404 }));
    db.pets[idx] = { ...db.pets[idx], ...(req.body as Partial<Pet>) };
    saveDB(db);
    return of(new HttpResponse({ status: 200, body: db.pets[idx] }));
  }

  // DELETE /api/pets/:id
  if (req.method === 'DELETE' && /^\/api\/pets\/[^/]+$/.test(req.url)) {
    const id = req.url.split('/').pop()!;
    const before = db.pets.length;
    const nextDb = { ...db, pets: db.pets.filter(p => p.id !== id) };
    saveDB(nextDb);
    return of(new HttpResponse({ status: before !== nextDb.pets.length ? 200 : 404 }));
  }

  return next(req);
};
