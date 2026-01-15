import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService, UserProfile } from './services/user.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { PaymentModalComponent } from './components/payment-modal/payment-modal.component';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PaymentModalComponent],
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
  settingsForm!: FormGroup;
  currentUser: UserProfile | null = null;
  previewImage: string | null = null;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  showPassword = false;
  currentPlan: 'Free' | 'Premium' = 'Free';
  showPaymentModal = false;
  planFeatures = {
    Free: [
      'Acceso a cursos básicos',
      'Progreso limitado',
      'Funciones básicas'
    ],
    Premium: [
      'Acceso a todos los cursos',
      'Progreso ilimitado',
      'Acceso prioritario a nuevos cursos',
      'Soporte premium',
      'Sin anuncios'
    ]
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.settingsForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: [''],
      profilePicture: [null],
      plan: ['Free']
    }, { validators: this.passwordMatchValidator });

    // Aplicar validaciones iniciales
    this.updatePasswordValidations();

    const passwordFields = ['currentPassword', 'newPassword', 'confirmPassword'];
    passwordFields.forEach(field => {
      this.settingsForm.get(field)?.valueChanges.subscribe(() => {
        this.updatePasswordValidations();
      });
    });

  }

  private updatePasswordValidations(): void {
    const currentPasswordControl = this.settingsForm.get('currentPassword');
    const newPasswordControl = this.settingsForm.get('newPassword');
    const confirmPasswordControl = this.settingsForm.get('confirmPassword');

    const currentPasswordValue = currentPasswordControl?.value;
    const newPasswordValue = newPasswordControl?.value;

    // Establecer validadores basados en el estado actual
    if (newPasswordValue || currentPasswordValue) {
      currentPasswordControl?.setValidators([Validators.required]);
      newPasswordControl?.setValidators([Validators.required, Validators.minLength(6)]);
      confirmPasswordControl?.setValidators([Validators.required]);
    } else {
      currentPasswordControl?.clearValidators();
      newPasswordControl?.clearValidators();
      confirmPasswordControl?.clearValidators();
    }

    // Actualizar estado de validación
    currentPasswordControl?.updateValueAndValidity({ emitEvent: false });
    newPasswordControl?.updateValueAndValidity({ emitEvent: false });
    confirmPasswordControl?.updateValueAndValidity({ emitEvent: false });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Cargar el plan actual del usuario almacenado
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      // Asegurarse de que el plan sea válido
      this.currentPlan = (currentUser.plan === 'Premium') ? 'Premium' : 'Free';
    }

    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getProfile().pipe(
      catchError(error => {
        this.errorMessage = error.message || 'Error al cargar el perfil. Por favor, intenta de nuevo.';
        return of(null);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(user => {
      if (user) {
        
        this.currentUser = user;
        if (user.plan && ['Free', 'Premium'].includes(user.plan)) {
          this.currentPlan = user.plan;
          
          // Actualizar también el AuthService con los datos más recientes
          this.authService.setUser({
            ...user,
            plan: user.plan
          });
        } else {
        }
        
        this.settingsForm.patchValue({
          username: user.username,
          email: user.email,
          plan: this.currentPlan
        });

        // Actualizar la imagen de perfil
        this.previewImage = this.userService.getProfilePictureUrl(user.id, user.avatar);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
        this.errorMessage = 'Solo se permiten imágenes (jpg, jpeg, png)';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'La imagen no debe superar los 5MB';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      this.settingsForm.patchValue({
        profilePicture: file
      });
    }
  }

  passwordMatchValidator(group: FormGroup): {[key: string]: any} | null {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');
    const currentPassword = group.get('currentPassword');

    // Solo validar si hay algún campo de contraseña con valor
    if (!newPassword?.value && !confirmPassword?.value && !currentPassword?.value) {
      return null;
    }

    // Verificar que la contraseña actual esté presente si se intenta cambiar
    if ((newPassword?.value || confirmPassword?.value) && !currentPassword?.value) {
      return { currentPasswordRequired: true };
    }

    // Verificar que la nueva contraseña y la confirmación coincidan
    if (newPassword?.value !== confirmPassword?.value) {
      return { passwordMismatch: true };
    }

    // Verificar longitud mínima si hay una nueva contraseña
    if (newPassword?.value && newPassword.value.length < 6) {
      return { passwordLength: true };
    }

    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    
    if (this.settingsForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = new FormData();
      const formValue = this.settingsForm.value;

      // Siempre incluir username y email ya que son requeridos
      formData.append('username', formValue.username);
      formData.append('email', formValue.email);

      // Manejar cambio de contraseña
      if (formValue.currentPassword && formValue.newPassword) {
        formData.append('currentPassword', formValue.currentPassword);
        formData.append('newPassword', formValue.newPassword);
      }

      // Manejar la imagen de perfil
      const fileInput = this.settingsForm.get('profilePicture')?.value;
      if (fileInput) {
        formData.append('avatar', fileInput);
      }

      formData.forEach((value, key) => {
        if (value instanceof File) {
        } else {
        }
      });

      this.userService.updateProfile(formData).pipe(
        catchError(error => {
          this.errorMessage = error.message || 'Error al actualizar el perfil';
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe(response => {
        if (response?.success) {
          this.currentUser = response.user;
          this.successMessage = response.message || 'Perfil actualizado correctamente';
          this.authService.setUser(response.user);
          
          // Limpiar campos de contraseña
          this.settingsForm.patchValue({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });

          // Actualizar la vista previa de la imagen
          this.previewImage = this.userService.getProfilePictureUrl(response.user.id, response.user.avatar);
        }
      });
    } else {
      Object.keys(this.settingsForm.controls).forEach(key => {
        const control = this.settingsForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  onPlanChange(plan: 'Free' | 'Premium'): void {
    
    if (this.currentPlan === plan) {
      return;
    }

    if (plan === 'Premium') {
      this.showPaymentModal = true;
    } else {
      this.processPlanChange(plan);
    }
  }

  onPaymentComplete(): void {
    this.showPaymentModal = false;
    this.processPlanChange('Premium');
  }

  onPaymentModalClose(): void {
    this.showPaymentModal = false;
  }

  private processPlanChange(plan: 'Free' | 'Premium'): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.updateUserPlan(plan).pipe(
      catchError(error => {
        this.errorMessage = error.message || 'Error al actualizar el plan';
        return of(null);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(response => {
      
      if (response?.success) {
        this.currentPlan = plan;
        this.successMessage = `Plan actualizado a ${plan} exitosamente`;
        this.settingsForm.patchValue({ plan });
        
        if (response.user) {
          this.currentUser = response.user;
          this.authService.setUser(response.user);
        }
        
      }
    });
  }

  onDeleteAccount() {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      this.isLoading = true;
      this.userService.deleteAccount().pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: () => {
          this.successMessage = 'Cuenta eliminada correctamente.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          this.errorMessage = err.message || 'No se pudo eliminar la cuenta.';
        }
      });
    }
  }
} 