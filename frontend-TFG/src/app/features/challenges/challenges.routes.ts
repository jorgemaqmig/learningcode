import { Routes } from '@angular/router';
import { ChallengesComponent } from './challenges.component';
import { ChallengeDetailComponent } from './challenge-detail/challenge-detail.component';

export const CHALLENGES_ROUTES: Routes = [
  {
    path: '',
    component: ChallengesComponent,
    children: [
      {
        path: ':id',
        component: ChallengeDetailComponent
      }
    ]
  }
]; 