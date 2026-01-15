import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService, Course, CourseSection } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent implements OnInit {
  courseSections: CourseSection[] = [];
  courseId: string = '';
  course: Course | null = null;
  hasProgress: boolean = false;
  userPlan: 'Free' | 'Premium' = 'Free';
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private authService: AuthService
  ) {
    // Suscribirse a cambios en el usuario para actualizar el plan
    this.authService.user$.subscribe(user => {
      this.userPlan = user?.plan || 'Free';
      if (this.courseId) {
        this.loadCourseSections();
      }
    });
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];
    const currentUser = this.authService.getCurrentUser();
    this.userPlan = currentUser?.plan || 'Free';
    
    this.loadCourseData();
  }

  private loadCourseData() {
    
    this.courseService.getCourseById(Number(this.courseId)).subscribe({
      next: (data) => {
        this.course = data;
        this.loadCourseSections();
      },
      error: (error) => {
        this.error = error.message || 'Error al cargar los detalles del curso';
        this.loading = false;
      }
    });
  }

  private loadCourseSections() {
    
    this.courseService.getCourseSections(Number(this.courseId)).subscribe({
      next: (data) => {
        
        // Ordenar las secciones por ID para mantener el orden correcto
        this.courseSections = data.sort((a, b) => a.id - b.id);
        
        this.loading = false;
        this.checkProgress();
      },
      error: (error) => {
        this.error = error.message || 'Error al cargar las secciones del curso';
        this.loading = false;
      }
    });
  }

  private checkProgress() {
    const userId = this.authService.getCurrentUser()?.id;
    
    if (userId) {
      this.courseService.getCourseProgress(userId, Number(this.courseId)).subscribe({
        next: (progressData) => {
          this.hasProgress = progressData.progress_percentage > 0;
        },
        error: (error) => {
          this.hasProgress = false;
        }
      });
    }
  }

  isPremiumLocked(section: CourseSection): boolean {
    const isLocked = section.is_premium && this.userPlan !== 'Premium';
    return isLocked;
  }

  startCourse() {
    this.router.navigate(['/course-map', this.courseId]);
  }
}
