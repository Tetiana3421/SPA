import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="app-footer">
      <div class="container">
        <span>© {{ year }} Pets App. Усі права захищені 🐾</span>
        <nav>
          <a href="https://angular.dev" target="_blank">Angular</a>
          <a href="https://dog.ceo/dog-api/" target="_blank">Dog API</a>
        </nav>
      </div>
    </footer>
  `
})
export class FooterComponent {
  year = new Date().getFullYear();
}
