import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from './auth.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  plan: 'Free' | 'Premium';
}

export interface ApiResponse {
  success: boolean;
  message: string;
  user: UserProfile;
}

export interface PlanUpdateResponse {
  success: boolean;
  message?: string;
  user?: UserProfile;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getProfile(): Observable<UserProfile> {

    const headers = this.getHeaders();

    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('No hay token de autenticación'));
    }

    return this.http.get<UserProfile>(`${this.apiUrl}/profile`, { headers }).pipe(
      tap(profile => {

        localStorage.setItem('debug_profile', JSON.stringify(profile));
      }),
      catchError(this.handleError.bind(this))
    );
  }

  updateProfile(formData: FormData): Observable<ApiResponse> {

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return throwError(() => new Error('No hay token de autenticación'));
    }

    const formDataKeys: string[] = [];
    formData.forEach((value, key) => {
      formDataKeys.push(key);
    });

    const headers = this.getHeaders();
    return this.http.put<ApiResponse>(`${this.apiUrl}/profile`, formData, { headers }).pipe(
      tap(response => {
      }),
      catchError(this.handleError.bind(this))
    );
  }

  getProfilePictureUrl(userId: number, avatar?: string): string {

    // Si no hay avatar o es la imagen por defecto, usar la local
    if (!avatar || avatar === 'default-profile.jpg') {
      return 'assets/avatars/default-profile.jpg';
    }

    // Si el avatar ya es una cadena Base64, devolverla directamente
    if (avatar.startsWith('data:image')) {
      return avatar;
    }

    // Si hay un avatar personalizado (nombre de archivo antiguo), usar la URL del backend
    const url = `${this.apiUrl}/profile/picture/${userId}`;
    return url;
  }

  updateUserPlan(plan: 'Free' | 'Premium'): Observable<PlanUpdateResponse> {
    return this.http.patch<PlanUpdateResponse>(`${this.apiUrl}/plan`, { plan }).pipe(
      tap(response => {
        if (response.success && response.user) {
          // Update stored user data
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          const updatedUser = { ...storedUser, plan: response.user.plan };
          localStorage.setItem('user', JSON.stringify(updatedUser));

          // Update auth service user data
          this.authService.setUser(updatedUser);
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  deleteAccount(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/profile`, { headers }).pipe(
      tap(() => {
        // Limpiar datos locales
        localStorage.clear();
        this.authService.logout();
      }),
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse) {

    let errorMessage = 'Ha ocurrido un error en el servidor.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);

      if (error.status === 401) {
        errorMessage = 'No estás autorizado. Por favor, inicia sesión de nuevo.';
        localStorage.removeItem('token');
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: this.router.url }
        });
      } else if (error.status === 403) {
        errorMessage = 'No tienes permiso para realizar esta acción.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado.';
      } else {
        errorMessage = error.error?.message || 'Error del servidor';
      }
    }

    return throwError(() => new Error(errorMessage));
  }
} 