import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData = {
    email: '',
    password: ''
  };
  errorMessage = '';
  isLoading = false;
  returnUrl: string = '/';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    // Obtener la URL de retorno si existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Si ya está autenticado, redirigir
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit() {
    
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.loginData).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (response) => {
        
        if (response.success && response.user) {
          // Verificar que el token se haya guardado correctamente
          const token = this.authService.getToken();
          const user = this.authService.getCurrentUser();
          console.log('Auth state after login:', {
            hasToken: !!token,
            hasUser: !!user,
            isAuthenticated: this.authService.isAuthenticated()
          });

          if (this.authService.isAuthenticated()) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.errorMessage = 'Error en la autenticación';
          }
        } else {
          this.errorMessage = 'Error en la autenticación';
        }
      },
      error: (error) => {
        
        if (error.status === 401) {
          this.errorMessage = 'Email o contraseña incorrectos';
        } else if (error.status === 0) {
          this.errorMessage = 'Error de conexión con el servidor';
        } else if (error.message === 'Formato de respuesta inválido del servidor') {
          this.errorMessage = 'Error en la respuesta del servidor';
        } else {
          this.errorMessage = error.error?.message || 'Error al iniciar sesión';
        }
      }
    });
  }
}
