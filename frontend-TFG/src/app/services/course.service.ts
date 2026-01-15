import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Course {
  id: number;
  title: string;
  description: string;
  difficulty_level: string;
  duration_minutes: number;
  is_premium: boolean;
}

export interface CourseSection {
  id: number;
  course_id: number;
  title: string;
  content: any[];
  is_premium: boolean;
  completado?: boolean;
}

export interface CourseResource {
  id: number;
  course_id: number;
  title: string;
  description: string;
  file_url: string;
  is_premium: boolean;
}

export interface CourseProgress {
  progress_percentage: number;
  completed_at: string | null;
  last_updated_at: string;
  completed_sections: number[];
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllCourses(): Observable<Course[]> {
    const currentUser = this.authService.getCurrentUser();
    const userPlan = currentUser?.plan;
    
    if (!userPlan) {
      console.warn('No user plan found, user might not be properly loaded');
    }
    
    return this.http.get<Course[]>(`${this.apiUrl}/courses`, {
      params: { userPlan: userPlan || 'Free' }
    });
  }

  getCourseById(id: number): Observable<Course> {
    const currentUser = this.authService.getCurrentUser();
    const userPlan = currentUser?.plan;
    
    if (!userPlan) {
      console.warn('No user plan found, user might not be properly loaded');
    }
    
    return this.http.get<Course>(`${this.apiUrl}/courses/${id}`, {
      params: { userPlan: userPlan || 'Free' }
    });
  }

  getCourseSections(courseId: number): Observable<CourseSection[]> {
    const currentUser = this.authService.getCurrentUser();
    const userPlan = currentUser?.plan;
    const userId = currentUser?.id;
    
    if (!userPlan) {
      console.warn('No user plan found, user might not be properly loaded');
    }
    
    const params: any = { userPlan: userPlan || 'Free' };
    if (userId) {
      params.userId = userId;
    }
    
    return this.http.get<CourseSection[]>(`${this.apiUrl}/courses/${courseId}/sections`, {
      params
    });
  }

  getCourseResources(courseId: number): Observable<CourseResource[]> {
    const currentUser = this.authService.getCurrentUser();
    const userPlan = currentUser?.plan;
    
    if (!userPlan) {
      console.warn('No user plan found, user might not be properly loaded');
    }
    
    return this.http.get<CourseResource[]>(`${this.apiUrl}/courses/${courseId}/resources`, {
      params: { userPlan: userPlan || 'Free' }
    });
  }

  getPremiumContent(courseId: number): Observable<any[]> {
    const userPlan = this.authService.getCurrentUser()?.plan;
    
    if (userPlan !== 'Premium') {
      throw new Error('Este contenido es exclusivo para usuarios Premium');
    }
    return this.http.get<any[]>(`${this.apiUrl}/courses/${courseId}/premium-content`);
  }

  getCourseProgress(userId: number, courseId: number): Observable<CourseProgress> {
    return this.http.get<CourseProgress>(
      `${this.apiUrl}/progress/users/${userId}/courses/${courseId}/progress`
    );
  }

  markSectionAsCompleted(userId: number, courseId: number, sectionId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/progress/users/${userId}/courses/${courseId}/sections/${sectionId}/complete`, {});
  }

  unmarkSectionAsCompleted(userId: number, courseId: number, sectionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/progress/users/${userId}/courses/${courseId}/sections/${sectionId}/complete`);
  }
} 