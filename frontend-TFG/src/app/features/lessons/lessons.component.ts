import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService, Course } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.css'
})
export class LessonsComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm: string = '';
  selectedLevel: string = '';
  userPlan: 'Free' | 'Premium' = 'Free';
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    this.userPlan = currentUser?.plan || 'Free';
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
    this.error = null;

    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.filteredCourses = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.error = 'No se pudieron cargar los cursos. Por favor, inténtalo de nuevo.';
        this.loading = false;
      }
    });
  }

  filterCourses() {

    this.filteredCourses = this.courses.filter(course => {
      const matchesSearch = !this.searchTerm ||
        course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesLevel = !this.selectedLevel ||
        course.difficulty_level.toLowerCase() === this.selectedLevel.toLowerCase();

      return matchesSearch && matchesLevel;
    });
  }

  isPremiumLocked(course: Course): boolean {
    const isLocked = course.is_premium && this.userPlan !== 'Premium';
    return isLocked;
  }
}
