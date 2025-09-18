import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PetsListComponent } from '../pets-list.component';
import { environment } from 'src/environments/environment';
import { By } from '@angular/platform-browser';

describe('PetsListComponent (integration)', () => {
  it('renders list and filters by search', async () => {
    const fixture = await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PetsListComponent]
    }).createComponent(PetsListComponent);
    const http = TestBed.inject(HttpTestingController);

    // Initial load
    fixture.detectChanges();
    http.expectOne(`${environment.apiBase}/pets`).flush([
      { id:'p1', name:'Рекс', type:'dog', ownerUid:'', createdAt:0 },
      { id:'p2', name:'Мурка', type:'cat', ownerUid:'', createdAt:0 }
    ]);
    fixture.detectChanges();

    // Should render 2 cards
    let cards = fixture.debugElement.queryAll(By.css('app-pet-card'));
    expect(cards.length).toBe(2);

    // Enter search
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'Мур';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    http.expectOne(`${environment.apiBase}/pets?search=%D0%9C%D1%83%D1%80`).flush([
      { id:'p2', name:'Мурка', type:'cat', ownerUid:'', createdAt:0 }
    ]);
    fixture.detectChanges();

    cards = fixture.debugElement.queryAll(By.css('app-pet-card'));
    expect(cards.length).toBe(1);
  });
});