import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChallengeService } from '../../../services/challenge.service';
import type { Challenge } from '../../../services/challenge.service';

@Component({
  selector: 'app-challenge-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './challenge-detail.component.html',
  styleUrls: ['./challenge-detail.component.css']
})
export class ChallengeDetailComponent implements OnInit {
  challenge: Challenge | null = null;
  currentHint = 0;
  showSolution = false;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.challengeService.getChallengeById(id).subscribe({
        next: (challenge) => {
          this.challenge = challenge;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'No se pudo cargar el reto.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Reto no encontrado.';
      this.loading = false;
    }
  }

  get hints(): string[] {
    try {
      return this.challenge && this.challenge.hints ? JSON.parse(this.challenge.hints) : [];
    } catch {
      return [];
    }
  }

  showNextHint() {
    if (this.currentHint < this.hints.length) {
      this.currentHint++;
    }
  }

  toggleSolution() {
    this.showSolution = !this.showSolution;
  }
} 