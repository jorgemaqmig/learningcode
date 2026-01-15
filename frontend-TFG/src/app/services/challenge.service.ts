import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty_level: string;
  course_id: number;
  section_id: number;
  is_premium: boolean;
  created_at: string;
  hints?: string;
  solution?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private apiUrl = `${environment.apiUrl}/challenges`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getChallenges(): Observable<Challenge[]> {
    const userPlan = this.authService.getCurrentUser()?.plan || 'Free';
    return this.http.get<Challenge[]>(`${this.apiUrl}?userPlan=${userPlan}`);
  }

  getChallengeById(id: number): Observable<Challenge> {
    const userPlan = this.authService.getCurrentUser()?.plan || 'Free';
    return this.http.get<Challenge>(`${this.apiUrl}/${id}?userPlan=${userPlan}`);
  }

  getChallengesByCourse(courseId: number): Observable<Challenge[]> {
    const userPlan = this.authService.getCurrentUser()?.plan || 'Free';
    return this.http.get<Challenge[]>(`${this.apiUrl}/course/${courseId}?userPlan=${userPlan}`);
  }

  getChallengesBySection(sectionId: number): Observable<Challenge[]> {
    const userPlan = this.authService.getCurrentUser()?.plan || 'Free';
    return this.http.get<Challenge[]>(`${this.apiUrl}/section/${sectionId}?userPlan=${userPlan}`);
  }
} 