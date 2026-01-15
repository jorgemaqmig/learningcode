import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  plan?: 'Free' | 'Premium';
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public user$ = this.userSubject.asObservable();
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.loadStoredUserData();
  }

  private loadStoredUserData(): void {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        const user = JSON.parse(userStr);
        
        this.userSubject.next(user);
        this.tokenSubject.next(token);
        
        this.refreshUserData();
      } else {
        console.warn('Incomplete auth data found');
        this.logout();
      }
    } catch (error) {
      console.error('Error loading stored user data:', error);
      this.logout();
    }
  }

  refreshUserData(): void {
    if (!this.isAuthenticated()) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    this.http.get<{id: number, username: string, email: string, avatar?: string, plan: 'Free' | 'Premium'}>(`${this.apiUrl}/users/profile`, { headers }).subscribe({
      next: (response) => {
        if (response) {
          this.storeAuthData(response, this.getToken()!);
        }
      },
      error: (error) => {
        console.error('Error refreshing user data:', error);
      }
    });
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users/login`, credentials).pipe(
      tap(response => {
        
        if (response.success && response.user && response.token) {
          this.storeAuthData(response.user, response.token);
        } else {
          console.error('Invalid login response format:', response);
          throw new Error('Formato de respuesta inválido del servidor');
        }
      })
    );
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users/register`, userData).pipe(
      tap(response => {
        if (response.success && response.user && response.token) {
          this.storeAuthData(response.user, response.token);
        } else {
          throw new Error('Formato de respuesta inválido del servidor');
        }
      })
    );
  }

  private storeAuthData(user: User, token: string): void {
    
    if (!user || !token) {
      console.error('Invalid auth data:', { hasUser: !!user, hasToken: !!token });
      throw new Error('Datos de autenticación inválidos');
    }

    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);
      this.tokenSubject.next(token);
      
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Error al guardar los datos de autenticación');
    }
  }

  setUser(user: User) {
    
    const currentUser = this.getCurrentUser();
    
    const updatedUser = {
      ...user,
      plan: user.plan || currentUser?.plan || 'Free'
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    this.userSubject.next(updatedUser);
  }

  logout() {
    
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.post(`${this.apiUrl}/users/logout`, {}, { headers }).subscribe({
        next: () => console.log('Logout request successful'),
        error: (error) => console.error('Error in logout request:', error)
      });
    }

    localStorage.clear();
    this.userSubject.next(null);
    this.tokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    const isAuth = !!token && !!user;
    
    if (token) {
    }
    
    
    return isAuth;
  }

  getToken(): string | null {
    const token = this.tokenSubject.value || localStorage.getItem('token');
    if (token) {
    } else {
    }
    return token;
  }

  getCurrentUser(): User | null {
    const user = this.userSubject.value;
    return user;
  }
}