import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService, Course, CourseSection } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
  private progressPercentage: number = 0;

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
          this.progressPercentage = progressData.progress_percentage || 0;
          this.hasProgress = this.progressPercentage > 0;
        },
        error: (error) => {
          this.hasProgress = false;
          this.progressPercentage = 0;
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

  // Helper methods for the new design
  getProgressPercentage(): number {
    return Math.round(this.progressPercentage);
  }

  getProgressOffset(): number {
    const circumference = 2 * Math.PI * 52; // 52 is the radius
    return circumference - (this.progressPercentage / 100) * circumference;
  }

  isNextModule(index: number): boolean {
    // Find the first incomplete module
    const firstIncompleteIndex = this.courseSections.findIndex(s => !s.completado);
    return index === firstIncompleteIndex;
  }

  goToSection(section: CourseSection): void {
    this.router.navigate(['/course-map', this.courseId]);
  }
}
