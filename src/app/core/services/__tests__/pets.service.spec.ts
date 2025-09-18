import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PetsService } from '../../services/pets.service';
import { environment } from '../../../../environments/environment';

describe('PetsService', () => {
  let svc: PetsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PetsService]
    });
    svc = TestBed.inject(PetsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('list$ should call GET /pets', () => {
    const mock = [{ id: 'p1', name:'Рекс', type: 'dog', ownerUid:'', createdAt: 0 }];
    svc.list$().subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].name).toBe('Рекс');
    });
    const r = http.expectOne(`${environment.apiBase}/pets`);
    expect(r.request.method).toBe('GET');
    r.flush(mock);
  });
});