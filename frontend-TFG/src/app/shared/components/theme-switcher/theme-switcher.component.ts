import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="theme-toggle" (click)="toggleTheme()">
      <i class="bi" [class.bi-moon-fill]="!(isDarkTheme$ | async)" [class.bi-sun-fill]="isDarkTheme$ | async"></i>
    </button>
  `,
  styles: [`
    :host {
      display: block;
    }
    .theme-toggle {
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid #fff;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      position: relative;
      z-index: 1000;
    }
    .theme-toggle:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }
    .bi {
      font-size: 1.2rem;
      color: #fff;
    }
  `]
})
export class ThemeSwitcherComponent implements OnInit {
  isDarkTheme$ = this.themeService.isDarkTheme$;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.setInitialTheme();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}