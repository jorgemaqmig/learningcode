import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CourseService, Course, CourseSection, CourseResource } from '../../services/course.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

interface ContentBlock {
  tipo: string;
  contenido: string;
  lenguaje?: string;
  url?: string;
  descripcion?: string;
}

interface Section {
  id: number;
  nombre: string;
  completado: boolean;
  is_premium: boolean;
  content?: ContentBlock[];
}

interface CourseProgress {
  progress_percentage: number;
  completed_at: string | null;
  last_updated_at: string;
  completed_sections: number[];
}

@Component({
  selector: 'app-course-map',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-map.component.html',
  styleUrls: ['./course-map.component.css']
})
export class CourseMapComponent implements OnInit, OnDestroy {
  courseId: string = '';
  apartados: Section[] = [];
  selectedIndex: number = 0;
  progresoCurso: number = 0;
  estadoCurso: string = 'no_iniciado';
  userId: string | null = null;
  userPlan: 'Free' | 'Premium' = 'Free';
  loading: boolean = true;
  error: string = '';
  curso: Course | null = null;
  recursos: CourseResource[] = [];

  private authSubscription: Subscription | null = null;
  private userSubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private authService: AuthService,
    private courseService: CourseService,
    private router: Router
  ) { }

  ngOnInit() {

    // Get current user info
    const currentUser = this.authService.getCurrentUser();
    this.userId = currentUser?.id?.toString() || null;
    this.userPlan = currentUser?.plan || 'Free';

    // Get course ID from route
    this.route.params.subscribe(params => {
      this.courseId = params['id'];

      if (this.courseId) {
        this.loadCourseData();
      } else {
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private parseContent(contentStr: string | any[]): ContentBlock[] {
    try {
      if (Array.isArray(contentStr)) {
        return contentStr;
      }

      if (typeof contentStr === 'string') {
        const parsed = JSON.parse(contentStr);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }

      return [];
    } catch (error) {
      return [];
    }
  }

  checkAuthStatus() {
    const currentUser = this.authService.getCurrentUser();
    this.userId = currentUser?.id?.toString() || null;
    this.userPlan = currentUser?.plan || 'Free';

    if (!this.userId) {
      this.apartados = [];
      this.progresoCurso = 0;
    } else if (this.courseId) {
      this.cargarApartadosYProgreso();
      this.cargarProgresoGeneralDelCurso();
    }
  }

  cargarApartadosYProgreso() {

    if (!this.userId || !this.courseId) {
      console.warn('Missing userId or courseId, cannot load sections.');
      this.apartados = [];
      this.loading = false;
      return;
    }

    this.loading = true;
    this.courseService.getCourseSections(Number(this.courseId)).subscribe({
      next: (data) => {
        this.apartados = data.map(section => {
          const parsedContent = section.content ? this.parseContent(section.content) : [];

          return {
            id: section.id,
            nombre: section.title,
            completado: section.completado || false,
            is_premium: section.is_premium,
            content: parsedContent
          };
        });

        if (this.apartados.length > 0) {
          this.selectedIndex = 0;
        }

        this.calcularProgresoTotal();
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.message || 'Error al cargar las secciones del curso';
        this.apartados = [];
        this.loading = false;
      }
    });
  }

  calcularProgresoTotal() {
    if (!this.apartados || this.apartados.length === 0) {
      this.progresoCurso = 0;
      return;
    }

    const completados = this.apartados.filter(apartado => apartado.completado).length;
    this.progresoCurso = Math.round((completados / this.apartados.length) * 100);
  }

  cargarProgresoGeneralDelCurso() {

    if (!this.userId || !this.courseId) {
      console.warn('Missing userId or courseId, cannot load general progress.');
      return;
    }

    this.courseService.getCourseProgress(Number(this.userId), Number(this.courseId)).subscribe({
      next: (progressData) => {
        this.progresoCurso = progressData.progress_percentage;
        // Determinar el estado basado en el progreso
        this.estadoCurso = progressData.completed_sections.length > 0 ? 'en_progreso' : 'no_iniciado';
        if (this.progresoCurso === 100) {
          this.estadoCurso = 'completado';
        }
      },
      error: (error: HttpErrorResponse) => {
        this.progresoCurso = 0;
        this.estadoCurso = 'no_iniciado';
      }
    });
  }

  selectApartado(index: number) {
    const apartado = this.apartados[index];

    this.selectedIndex = index;
  }

  isPremiumLocked(apartado: Section): boolean {
    const isLocked = apartado.is_premium && this.userPlan !== 'Premium';
    return isLocked;
  }

  getPreviewText(bloque: ContentBlock): string {
    switch (bloque.tipo) {
      case 'texto':
        const text = bloque.contenido.substring(0, 50);
        return text.length < bloque.contenido.length ? `${text}...` : text;
      case 'codigo':
        return `Ejemplo de código en ${bloque.lenguaje || 'programación'}`;
      case 'imagen':
        return bloque.descripcion || 'Imagen del recurso';
      default:
        return 'Contenido del recurso';
    }
  }

  marcarComoRealizado(index: number) {

    if (!this.authService.isAuthenticated()) {
      alert('Debes iniciar sesión para guardar tu progreso.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.userId || !this.courseId) {
      return;
    }

    const apartado = this.apartados[index];
    if (this.isPremiumLocked(apartado)) {
      alert('Debes ser usuario Premium para marcar este apartado como completado');
      return;
    }

    this.http.post(`${environment.apiUrl}/progress/users/${this.userId}/courses/${this.courseId}/sections/${apartado.id}/complete`, {})
      .subscribe({
        next: () => {
          apartado.completado = true;
          this.cargarProgresoGeneralDelCurso();
        },
        error: (error: HttpErrorResponse) => {

        }
      });
  }

  desmarcarComoRealizado(index: number) {
    // Verificar autenticación antes de proceder
    if (!this.authService.isAuthenticated()) {
      alert('Debes iniciar sesión para guardar tu progreso.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.userId || !this.courseId) {
      return;
    }
    const apartado = this.apartados[index];
    if (!apartado || typeof apartado.id === 'undefined') {
      return;
    }

    this.http.delete(`${environment.apiUrl}/progress/users/${this.userId}/courses/${this.courseId}/sections/${apartado.id}/complete`)
      .subscribe({
        next: () => {
          apartado.completado = false;
          this.cargarProgresoGeneralDelCurso();
        },
        error: (error: HttpErrorResponse) => {

        }
      });
  }

  loadCourseData() {

    this.courseService.getCourseById(Number(this.courseId)).subscribe({
      next: (course) => {
        this.curso = course;
      },
      error: (error) => {
      }
    });

    this.courseService.getCourseSections(Number(this.courseId)).subscribe({
      next: (sections) => {
        this.apartados = sections.map(section => ({
          id: section.id,
          nombre: section.title,
          completado: section.completado || false,
          is_premium: section.is_premium,
          content: section.content ? this.parseContent(section.content) : undefined
        }));
        this.calcularProgresoTotal();
      },
      error: (error) => {
      }
    });

    this.courseService.getCourseResources(Number(this.courseId)).subscribe({
      next: (resources) => {
        this.recursos = resources;
      },
      error: (error) => {
      }
    });
  }
}