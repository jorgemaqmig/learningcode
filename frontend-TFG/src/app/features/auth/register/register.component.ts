import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  isLoading = false;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  onSubmit() {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const userData = {
      username: this.registerData.username,
      email: this.registerData.email,
      password: this.registerData.password
    };

    this.isLoading = true;
    this.http.post(`${environment.apiUrl}/users/register`, userData)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error en el registro:', error);
          this.isLoading = false;
          alert('Error al registrar el usuario');
        }
      });
  }
}
