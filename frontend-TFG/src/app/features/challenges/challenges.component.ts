import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengeService } from '../../services/challenge.service';
import type { Challenge } from '../../services/challenge.service';
import { Router, RouterOutlet } from '@angular/router';
import { ChallengeDetailComponent } from './challenge-detail/challenge-detail.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-challenges',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.css']
})
export class ChallengesComponent implements OnInit {
  challenges: Challenge[] = [];
  loading = true;
  error: string | null = null;
  selectedChallenge: Challenge | null = null;
  showModal = false;
  modalLoading = false;
  modalError: string | null = null;
  currentHint = 0;
  showSolution = false;
  searchTerm: string = '';
  selectedLevel: string = '';
  filteredChallenges: Challenge[] = [];

  constructor(
    public challengeService: ChallengeService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadChallenges();
  }

  loadChallenges() {
    this.loading = true;
    this.error = null;

    this.challengeService.getChallenges().toPromise().then((challenges) => {
      this.challenges = challenges || [];
      this.filteredChallenges = this.challenges;
      this.loading = false;
    }).catch(error => {
      console.error('Error loading challenges:', error);
      this.error = 'Error al cargar los retos. Por favor, intenta de nuevo.';
      this.loading = false;
    });
  }

  getDifficultyClass(level: string): string {
    switch (level.toLowerCase()) {
      case 'principiante':
        return 'bg-success';
      case 'intermedio':
        return 'bg-warning';
      case 'avanzado':
        return 'bg-danger';
      default:
        return 'bg-primary';
    }
  }

  parseHints(hints: string | undefined): string[] {
    try {
      return hints ? JSON.parse(hints) : [];
    } catch {
      return [];
    }
  }

  showNextHint() {
    if (this.selectedChallenge && this.currentHint < this.parseHints(this.selectedChallenge.hints).length) {
      this.currentHint++;
    }
  }

  toggleSolution() {
    this.showSolution = !this.showSolution;
  }

  async openChallengeModal(challengeId: number) {
    this.currentHint = 0;
    this.showSolution = false;
    this.selectedChallenge = null;
    this.modalLoading = true;
    this.modalError = null;
    this.showModal = true;
    try {
      const challenge = await this.challengeService.getChallengeById(challengeId).toPromise();
      this.selectedChallenge = challenge ?? null;
    } catch (err) {
      this.modalError = 'No se pudo cargar el reto.';
      this.selectedChallenge = null;
    } finally {
      this.modalLoading = false;
    }
  }

  closeModal() {
    this.currentHint = 0;
    this.showSolution = false;
    this.showModal = false;
    this.selectedChallenge = null;
    this.modalError = null;
    this.modalLoading = false;
  }

  startChallenge(challengeId: number) {
    this.openChallengeModal(challengeId);
  }

  retryChallenge(challengeId: number) {
  }

  filterChallenges() {
    this.filteredChallenges = this.challenges.filter(challenge => {
      const matchesSearch = !this.searchTerm ||
        challenge.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        challenge.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesLevel = !this.selectedLevel ||
        challenge.difficulty_level.toLowerCase() === this.selectedLevel.toLowerCase();
      return matchesSearch && matchesLevel;
    });
  }
}
