import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_ID_KEY = 'userId';
  private readonly USER_KEY = 'user';
  
  public authStateChanged = new Subject<void>();
  
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private router: Router) {
    const userId = localStorage.getItem(this.USER_ID_KEY);
    const userJson = localStorage.getItem(this.USER_KEY);
    
    if (userJson) {
      const user = JSON.parse(userJson);
      this.userSubject.next(user);
      
      if (!userId && user && user.id) {
        localStorage.setItem(this.USER_ID_KEY, user.id.toString());
      }
    }
  }

  setUser(user: any) {
    if (!user) return;
    
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.userSubject.next(user);
    
    if (user.id) {
      localStorage.setItem(this.USER_ID_KEY, user.id.toString());
    }
    
    this.authStateChanged.next();
  }

  login(userId: string, token?: string, userData?: any): void {
    localStorage.setItem(this.USER_ID_KEY, userId);
    
    if (userData) {
      if (!userData.username && userData.name) {
        userData.username = userData.name;
      } else if (!userData.username) {
        userData.username = 'Usuario';
      }
      localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
      this.userSubject.next(userData);
    } else {
      const userJson = localStorage.getItem(this.USER_KEY);
      if (userJson) {
        const user = JSON.parse(userJson);
        user.id = userId;
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.userSubject.next(user);
      } else {
        const basicUser = { id: userId, username: 'Usuario' };
        localStorage.setItem(this.USER_KEY, JSON.stringify(basicUser));
        this.userSubject.next(basicUser);
      }
    }
    
    this.authStateChanged.next();
  }

  logout(): void {
    const theme = localStorage.getItem('theme');
    
    localStorage.removeItem(this.USER_ID_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    if (theme) {
      localStorage.setItem('theme', theme);
    }
    
    this.userSubject.next(null);
    
    
    this.authStateChanged.next();
    
    this.router.navigate(['/login']);
  }

  getCurrentUserId(): string | null {
    const userId = localStorage.getItem(this.USER_ID_KEY);
    return userId;
  }

  getCurrentUser() {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    const authenticated = !!localStorage.getItem(this.USER_ID_KEY);
    return authenticated;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}