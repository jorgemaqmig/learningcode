import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Actualizar a Premium</h3>
          <button class="close-button" (click)="onClose()">×</button>
        </div>
        
        <div class="modal-body">
          <div class="payment-summary mb-4">
            <h4>Resumen de la compra</h4>
            <div class="price-info">
              <span class="price">9.99€</span>
              <span class="period">/mes</span>
            </div>
            <ul class="benefits-list">
              <li><i class="bi bi-check-circle-fill"></i> Acceso a todos los cursos premium</li>
              <li><i class="bi bi-check-circle-fill"></i> Contenido exclusivo</li>
              <li><i class="bi bi-check-circle-fill"></i> Soporte prioritario</li>
              <li><i class="bi bi-check-circle-fill"></i> Sin anuncios</li>
            </ul>
          </div>

          <form (submit)="onSubmit($event)" class="payment-form">
            <div class="form-group">
              <label for="cardNumber">Número de tarjeta</label>
              <input 
                type="text" 
                id="cardNumber" 
                class="form-control" 
                placeholder="1234 5678 9012 3456"
                [(ngModel)]="cardNumber"
                name="cardNumber"
                required
                pattern="[0-9]{16}"
                maxlength="16">
            </div>

            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <label for="expiryDate">Fecha de expiración</label>
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
                <div class="form-group">
                  <label for="cvv">CVV</label>
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

            <button type="submit" class="btn btn-primary w-100 mt-4" [disabled]="isProcessing">
              <span *ngIf="!isProcessing">Confirmar pago</span>
              <span *ngIf="isProcessing">
                <i class="bi bi-arrow-repeat spinning"></i> Procesando...
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    :host-context(.dark-theme) .modal-content {
      background: var(--card-bg);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }
    :host-context(.dark-theme) .modal-header {
      border-bottom: 1px solid var(--border-color);
    }
    :host-context(.dark-theme) .modal-header h3,
    :host-context(.dark-theme) label {
      color: var(--text-primary);
    }
    :host-context(.dark-theme) .close-button {
      color: var(--text-secondary);
    }
    :host-context(.dark-theme) .modal-body {
      background: var(--card-bg);
    }
    :host-context(.dark-theme) .payment-summary {
      background: var(--secondary-bg);
      color: var(--text-primary);
    }
    :host-context(.dark-theme) .form-control {
      background: var(--secondary-bg);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }
    :host-context(.dark-theme) .form-control:focus {
      border-color: var(--button-primary);
      box-shadow: 0 0 0 0.2rem rgba(114, 137, 218, 0.15);
    }
    :host-context(.dark-theme) .benefits-list li {
      color: var(--text-secondary);
    }
    :host-context(.dark-theme) .price {
      color: var(--button-primary);
    }
    :host-context(.dark-theme) .form-control::placeholder {
      color: #fff;
      opacity: 1;
    }
    

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      margin: 0;
      color: #333;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .payment-summary {
      text-align: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .price-info {
      margin: 1rem 0;
    }

    .price {
      font-size: 2rem;
      font-weight: bold;
      color: #007bff;
    }

    .period {
      color: #666;
    }

    .benefits-list {
      list-style: none;
      padding: 0;
      margin: 1rem 0;
      text-align: left;
    }

    .benefits-list li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      color: #666;
    }

    .benefits-list i {
      color: #28a745;
    }

    .payment-form {
      margin-top: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
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