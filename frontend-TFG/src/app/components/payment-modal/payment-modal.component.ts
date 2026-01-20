import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-content glass-card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">Actualizar a <span class="premium-text">Premium</span></h3>
          <button class="close-btn" (click)="onClose()">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="payment-summary glass-card p-4 mb-4">
            <h4 class="summary-title">Resumen de la suscripción</h4>
            <div class="price-display">
              <span class="currency">€</span>
              <span class="amount">9.99</span>
              <span class="period">/mes</span>
            </div>
            <ul class="benefits-list">
              <li><i class="bi bi-check-circle-fill"></i> Acceso ilimitado a todos los cursos</li>
              <li><i class="bi bi-check-circle-fill"></i> Contenido exclusivo y avanzado</li>
              <li><i class="bi bi-check-circle-fill"></i> Soporte prioritario 24/7</li>
              <li><i class="bi bi-check-circle-fill"></i> Experiencia sin anuncios</li>
            </ul>
          </div>

          <form (submit)="onSubmit($event)" class="payment-form">
            <div class="form-group mb-3">
              <label class="label-with-icon" for="cardNumber">
                <i class="bi bi-credit-card"></i> Número de tarjeta
              </label>
              <input 
                type="text" 
                id="cardNumber" 
                class="form-control" 
                placeholder="0000 0000 0000 0000"
                [(ngModel)]="cardNumber"
                name="cardNumber"
                required
                pattern="[0-9]{16}"
                maxlength="16">
            </div>

            <div class="row">
              <div class="col-6">
                <div class="form-group mb-3">
                  <label class="label-with-icon" for="expiryDate">
                    <i class="bi bi-calendar-event"></i> Expiración
                  </label>
                  <input 
                    type="text" 
                    id="expiryDate" 
                    class="form-control" 
                    placeholder="MM/YY"
                    [(ngModel)]="expiryDate"
                    name="expiryDate"
                    required
                    pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
                    maxlength="5">
                </div>
              </div>
              <div class="col-6">
                <div class="form-group mb-3">
                  <label class="label-with-icon" for="cvv">
                    <i class="bi bi-lock"></i> CVV
                  </label>
                  <input 
                    type="text" 
                    id="cvv" 
                    class="form-control" 
                    placeholder="123"
                    [(ngModel)]="cvv"
                    name="cvv"
                    required
                    pattern="[0-9]{3,4}"
                    maxlength="4">
                </div>
              </div>
            </div>

            <button type="submit" class="btn-premium-gold w-100 mt-4" [disabled]="isProcessing">
              <span *ngIf="!isProcessing"><i class="bi bi-shield-check me-2"></i>Confirmar pago</span>
              <span *ngIf="isProcessing">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                Procesando...
              </span>
            </button>
            <p class="text-center mt-3 text-muted small">
              <i class="bi bi-lock-fill me-1"></i> Pago seguro cifrado SSL
            </p>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
      padding: 1rem;
      animation: fadeIn 0.3s ease-out;
    }

    .modal-content {
      width: 100%;
      max-width: 500px;
      padding: 0;
      overflow: hidden;
      animation: slideUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    }

    .glass-card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.4);
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
        border-radius: 28px;
    }

    :host-context(.dark-theme) .glass-card {
        background: rgba(45, 48, 54, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
    }

    .modal-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    :host-context(.dark-theme) .modal-header {
      border-bottom-color: rgba(255, 255, 255, 0.05);
    }

    .modal-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-primary);
    }

    .premium-text {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .close-btn {
      background: rgba(0, 0, 0, 0.05);
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--text-secondary);
      transition: all 0.3s ease;
    }

    .close-btn:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      transform: rotate(90deg);
    }

    .modal-body {
      padding: 2rem;
    }

    .payment-summary {
      background: rgba(99, 102, 241, 0.03);
      border-color: rgba(99, 102, 241, 0.1);
    }

    :host-context(.dark-theme) .payment-summary {
        background: rgba(255, 255, 255, 0.02);
    }

    .summary-title {
        font-size: 0.9rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--text-secondary);
        margin-bottom: 1rem;
        text-align: center;
    }

    .price-display {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .currency {
      font-size: 1.5rem;
      font-weight: 700;
      vertical-align: top;
      margin-right: 2px;
      color: var(--text-primary);
    }

    .amount {
      font-size: 3rem;
      font-weight: 900;
      color: var(--text-primary);
      letter-spacing: -2px;
    }

    .period {
      font-size: 1.1rem;
      color: var(--text-secondary);
      font-weight: 600;
    }

    .benefits-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .benefits-list li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.6rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .benefits-list i {
      color: #f59e0b;
    }

    .label-with-icon {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .form-control {
      background: rgba(255, 255, 255, 0.5);
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      padding: 0.8rem 1rem;
      color: var(--text-primary);
      transition: all 0.3s ease;
    }

    :host-context(.dark-theme) .form-control {
        background: rgba(0, 0, 0, 0.2);
        border-color: rgba(255, 255, 255, 0.1);
    }

    .form-control:focus {
        border-color: #fbbf24;
        box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.1);
        background: white;
        outline: none;
    }

    :host-context(.dark-theme) .form-control:focus {
        background: rgba(0, 0, 0, 0.3);
    }

    .btn-premium-gold {
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        color: #78350f;
        padding: 1rem;
        border-radius: 14px;
        font-weight: 800;
        border: none;
        transition: all 0.3s ease;
        box-shadow: 0 8px 25px rgba(245, 158, 11, 0.2);
    }

    .btn-premium-gold:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(245, 158, 11, 0.3);
        filter: brightness(1.05);
    }

    .btn-premium-gold:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    .small { font-size: 0.8rem; }
  `]
})
export class PaymentModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() paymentComplete = new EventEmitter<void>();

  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';
  isProcessing: boolean = false;

  onClose() {
    this.close.emit();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.isProcessing = true;

    setTimeout(() => {
      this.isProcessing = false;
      this.paymentComplete.emit();
    }, 2000);
  }
}