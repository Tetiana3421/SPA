import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // ⬅ додали RouterLink
import { NgIf } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { FooterComponent } from './shared/layout/footer.component';

const THEME_KEY = 'app_theme'; // 'light' | 'dark'

@Component({
  selector: 'app-root',
  standalone: true,
  // ⬅ додали RouterLink у imports
  imports: [RouterOutlet, RouterLink, NgIf, FooterComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(public auth: AuthService) {
    const saved = (localStorage.getItem(THEME_KEY) || '') as 'light' | 'dark' | '';
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  }

  themeIcon = this.currentThemeIcon();

  toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null;
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    this.themeIcon = this.currentThemeIcon();
  }

  private currentThemeIcon() {
    const cur = document.documentElement.getAttribute('data-theme');
    return cur === 'dark' ? '☀️' : '🌙';
  }
}
