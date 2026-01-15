import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(this.getStoredTheme());
  isDarkTheme$ = this.isDarkTheme.asObservable();

  constructor() {
    this.setInitialTheme();
  }

  private getStoredTheme(): boolean {
    const stored = localStorage.getItem('theme');
    if (stored) {
      return stored === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggleTheme() {
    const newTheme = !this.isDarkTheme.value;
    this.isDarkTheme.next(newTheme);
    document.body.classList.toggle('dark-theme', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  }

  setInitialTheme() {
    const isDark = this.getStoredTheme();
    this.isDarkTheme.next(isDark);
    document.body.classList.toggle('dark-theme', isDark);
  }
}