import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

interface CourseProgress {
  course_id: string;
  progress_percentage: number;
  status: string;
  completed_at: string | null;
  course?: {
    title: string;
    description: string;
    difficulty_level: string;
    duration_minutes: number;
  };
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  username: string = '';
  userAvatar: string = 'assets/avatars/default-profile.jpg';
  userId: string | null = null;
  courseProgress: CourseProgress[] = [];
  completedCourses: CourseProgress[] = [];
  inProgressCourses: CourseProgress[] = [];
  private userSubscription: Subscription | null = null;
  private authStateSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    // Suscribirse a cambios en el usuario
    this.userSubscription = this.authService.user$.subscribe(user => {
      if (user) {
        this.initializeProfile(user);
      } else {
        this.clearProfileData();
      }
    });

    // Suscribirse a cambios en el estado de autenticación
    this.authStateSubscription = this.authService.authStateChanged.subscribe(() => {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.initializeProfile(currentUser);
      } else {
        this.clearProfileData();
      }
    });

    // Inicialización inicial
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.initializeProfile(currentUser);
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    // Limpiar suscripciones
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
  }

  private clearProfileData() {
    this.username = '';
    this.userAvatar = 'assets/avatars/default-profile.jpg';
    this.userId = null;
    this.courseProgress = [];
    this.completedCourses = [];
    this.inProgressCourses = [];
  }

  private async initializeProfile(user: any) {
    this.clearProfileData();

    this.username = user.username || 'Usuario';
    this.userId = user.id?.toString() || null;
    if (user.id) {
      this.userAvatar = this.userService.getProfilePictureUrl(user.id, user.avatar);
    }

    if (this.userId) {
      await this.loadUserProgress();
    }
  }

  private async loadUserProgress() {
    if (!this.userId) {
      return;
    }

    try {
      const progress = await this.http.get<CourseProgress[]>(`${environment.apiUrl}/progress/users/${this.userId}/progress`).toPromise();

      if (!progress) {
        return;
      }

      this.courseProgress = progress;
      await this.loadCourseDetails();
    } catch (error) {
    }
  }

  private async loadCourseDetails() {
    try {
      const user = this.authService.getCurrentUser();
      const userPlan = user?.plan || 'Free';

      const courseDetailsPromises = this.courseProgress.map(progress =>
        this.http.get<any>(`${environment.apiUrl}/courses/${progress.course_id}?userPlan=${userPlan}`).toPromise()
      );

      const courseDetails = await Promise.all(courseDetailsPromises);

      this.courseProgress = this.courseProgress.map((progress, index) => ({
        ...progress,
        course: courseDetails[index]
      }));

      // Separar cursos completados y en progreso
      this.completedCourses = this.courseProgress.filter(p => p.status === 'completed');
      this.inProgressCourses = this.courseProgress.filter(p => p.status !== 'completed');
    } catch (error) {
    }
  }

  continueCourse(courseId: string) {
    this.router.navigate(['/course-map', courseId]);
  }
}
