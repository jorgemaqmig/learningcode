import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="code-editor-container" [class.dark-theme]="isDarkTheme">
      
      <!-- Toolbar -->
      <div class="editor-toolbar">
        <div class="language-badge">
          <i class="bi" [ngClass]="getLanguageIcon()"></i>
          <span>{{ language | titlecase }}</span>
        </div>
        
        <div class="actions">
          <button class="btn-reset" (click)="resetCode()">
            <i class="bi bi-arrow-counterclockwise"></i>
            <span>Reiniciar</span>
          </button>
          
          <button class="btn-run" (click)="executeCode()" [disabled]="isRunning">
            <i class="bi" [ngClass]="isRunning ? 'bi-hourglass-split' : 'bi-play-fill'"></i>
            <span>{{ isRunning ? 'Ejecutando...' : 'Ejecutar' }}</span>
          </button>
        </div>
      </div>

      <!-- Editor Area (Using textarea as simple fallback for now, Monaco would be integrated here) -->
      <div class="editor-area">
        <div class="line-numbers">
          <span *ngFor="let line of lines; let i = index">{{ i + 1 }}</span>
        </div>
        <textarea 
          #codeTextarea
          [(ngModel)]="code" 
          (input)="onCodeChange()"
          (keydown)="handleTab($event)"
          spellcheck="false"
          placeholder="Escribe tu código aquí...">
        </textarea>
      </div>

      <!-- Console Output -->
      <div class="console-output" [class.has-error]="executionResult?.success === false">
        <div class="console-header">
          <i class="bi bi-terminal"></i>
          <span>Consola</span>
        </div>
        
        <div class="console-body" *ngIf="executionResult">
          <!-- Banner de Verificación -->
          <div *ngIf="executionResult.testsPassed === true" class="alert-success">
            <i class="bi bi-check-circle-fill"></i>
            <span>¡Excelente! Tu solución es correcta.</span>
          </div>
          <div *ngIf="executionResult.testsPassed === false" class="alert-error">
            <i class="bi bi-x-circle-fill"></i>
            <span>La solución no es correcta. Revisa la salida para más detalles.</span>
          </div>

          <pre *ngIf="executionResult.output">{{ executionResult.output }}</pre>
          <div *ngIf="!executionResult.output && executionResult.success" class="empty-output">
            (El programa finalizó correctamente sin salida)
          </div>
          <div *ngIf="!executionResult.success" class="error-message">
            {{ executionResult.error }}
          </div>
        </div>
        
        <div class="console-placeholder" *ngIf="!executionResult && !isRunning">
          Pulsa "Ejecutar" para ver la salida aquí...
        </div>
        
        <div class="console-loading" *ngIf="isRunning">
          <div class="spinner-border text-primary spinner-sm me-2" role="status"></div>
          <span>Ejecutando código en servidor seguro...</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .code-editor-container {
      display: flex;
      flex-direction: column;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      background: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.02);
      margin-bottom: 2rem;
    }

    /* Toolbar */
    .editor-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .language-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #475569;
      font-size: 0.9rem;
      background: #e2e8f0;
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
    }

    .actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn-reset {
      background: transparent;
      border: 1px solid #cbd5e1;
      color: #64748b;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s;
    }

    .btn-reset:hover {
      background: #f1f5f9;
      color: #334155;
    }

    .btn-run {
      background: linear-gradient(135deg, #10b981, #059669);
      border: none;
      color: white;
      padding: 0.4rem 1rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s;
    }

    .btn-run:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
    }

    .btn-run:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    /* Editor Area */
    .editor-area {
      display: flex;
      height: 300px;
      overflow: hidden;
      position: relative;
      background: #f8fafc;
    }

    .line-numbers {
      padding: 1rem 0.5rem;
      background: #f1f5f9;
      color: #94a3b8;
      text-align: right;
      font-family: 'Fira Code', monospace;
      font-size: 14px;
      line-height: 1.5;
      user-select: none;
      min-width: 2.5rem;
      border-right: 1px solid #e2e8f0;
    }

    .line-numbers span {
      display: block;
    }

    textarea {
      flex: 1;
      border: none;
      resize: none;
      padding: 1rem;
      font-family: 'Fira Code', monospace;
      font-size: 14px;
      line-height: 1.5;
      color: #334155;
      background: transparent;
      outline: none;
      white-space: pre;
      overflow-y: auto;
      tab-size: 4;
    }

    /* Console Output */
    .console-output {
      border-top: 1px solid #e2e8f0;
      background: #1e293b;
      color: #e2e8f0;
      min-height: 120px;
      display: flex;
      flex-direction: column;
    }

    .console-header {
      padding: 0.5rem 1rem;
      background: #0f172a;
      font-size: 0.8rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-bottom: 1px solid #334155;
    }

    .console-body {
      padding: 1rem;
      font-family: 'Fira Code', monospace;
      font-size: 0.9rem;
      overflow-x: auto;
    }

    .console-body pre {
      margin: 0;
      white-space: pre-wrap;
    }

    .empty-output {
      color: #64748b;
      font-style: italic;
    }

    .error-message {
      color: #ef4444;
    }

    .console-placeholder {
      padding: 2rem;
      text-align: center;
      color: #64748b;
      font-style: italic;
      font-size: 0.9rem;
    }

    .console-loading {
      padding: 2rem;
      text-align: center;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .alert-success, .alert-error {
      padding: 0.75rem 1rem;
      border-radius: 6px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .alert-success {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .alert-error {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    /* Dark Theme Support (via host-context from parent, but this component handles internal styles) */
    :host-context(.dark-theme) .code-editor-container {
      background: #1e2124;
      border-color: #2d3748;
    }

    :host-context(.dark-theme) .editor-toolbar {
      background: #2d3748;
      border-bottom-color: #4a5568;
    }

    :host-context(.dark-theme) .language-badge {
      background: #4a5568;
      color: #e2e8f0;
    }

    :host-context(.dark-theme) .btn-reset {
      border-color: #4a5568;
      color: #cbd5e1;
    }

    :host-context(.dark-theme) .btn-reset:hover {
      background: #4a5568;
      color: white;
    }

    :host-context(.dark-theme) .editor-area {
      background: #1a202c;
    }

    :host-context(.dark-theme) .line-numbers {
      background: #2d3748;
      color: #718096;
      border-right-color: #4a5568;
    }

    :host-context(.dark-theme) textarea {
      color: #e2e8f0;
    }
  `]
})
export class CodeEditorComponent implements OnInit, OnChanges {
  @Input() initialCode: string = '';
  @Input() language: string = 'javascript';
  @Input() isDarkTheme: boolean = false;
  @Input() testCode: string = '';

  @Output() solvedCorrectly = new EventEmitter<void>();

  code: string = '';
  lines: number[] = [1];
  isRunning: boolean = false;
  executionResult: any = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.code = this.initialCode;
    this.updateLines();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialCode']) {
      this.code = this.initialCode;
      this.updateLines();
    }
  }

  onCodeChange() {
    this.updateLines();
  }

  private updateLines() {
    const lineCount = this.code.split('\\n').length;
    this.lines = Array(lineCount).fill(0);
  }

  handleTab(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert 2 spaces for tab
      this.code = this.code.substring(0, start) + '  ' + this.code.substring(end);

      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  }

  resetCode() {
    this.code = this.initialCode;
    this.executionResult = null;
    this.updateLines();
  }

  executeCode() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.executionResult = null;

    this.http.post<any>(`${environment.apiUrl}/execute`, {
      language: this.language,
      source: this.code,
      testCode: this.testCode
    }).subscribe({
      next: (response) => {
        this.isRunning = false;

        if (response.success && response.run) {
          this.executionResult = {
            success: true,
            output: response.run.output,
            testsPassed: response.testsPassed
          };

          if (response.testsPassed === true) {
            this.solvedCorrectly.emit();
          }
        } else {
          this.executionResult = {
            success: false,
            error: 'No se pudo obtener la salida de la ejecución.'
          };
        }
      },
      error: (error) => {
        this.isRunning = false;
        this.executionResult = {
          success: false,
          error: error.error?.error || 'Error de conexión con el servidor de ejecución.'
        };
      }
    });
  }

  getLanguageIcon(): string {
    const map: any = {
      'javascript': 'bi-filetype-js',
      'python': 'bi-filetype-py',
      'java': 'bi-filetype-java',
      'cpp': 'bi-filetype-cpp'
    };
    return map[this.language.toLowerCase()] || 'bi-code-square';
  }
}
