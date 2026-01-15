import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LessonsComponent } from './features/lessons/lessons.component';
import { ProfileComponent } from './features/profile/profile.component';
import { CourseDetailsComponent } from './features/course-details/course-details.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { CourseMapComponent } from './features/course-map/course-map.component';
import { UserSettingsComponent } from './user-settings.component';
import { authGuard } from './guards/auth.guard';
import { CHALLENGES_ROUTES } from './features/challenges/challenges.routes';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'lessons', 
    component: LessonsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'lessons/:id', 
    component: CourseDetailsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'challenges', 
    children: CHALLENGES_ROUTES,
    canActivate: [authGuard]
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'course-map/:id', 
    component: CourseMapComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'user-settings', 
    component: UserSettingsComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
