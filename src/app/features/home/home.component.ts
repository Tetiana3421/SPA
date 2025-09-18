import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <h1>Вітаємо у Pets SPA</h1>
    <p>Керуйте списком домашніх тварин: додавайте, переглядайте, редагуйте.</p>
  `
})
export class HomeComponent {}