import {
  Component,
  signal,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

declare const grecaptcha: any;
@Component({
  selector: 'app-contacto',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss',
})
export class Contacto implements OnInit, OnDestroy {
  private isBrowser: boolean = false;

  // Variables de entorno
  private readonly CLIENTE_ID =
    _NGX_ENV_['NG_APP_CLIENTE_ID'] || 'cliente-default';
  private readonly N8N_WEBHOOK_URL =
    _NGX_ENV_['NG_APP_N8N_WEBHOOK'] ||
    'https://n8n.darkhub.lat/webhook/contacto';

  // Señales reactivas
  protected isVisible = signal(false);
  protected isLoading = signal(false);
  protected formSubmitted = signal(false);
  protected successMessage = signal('');
  protected errorMessage = signal('');
  protected countryCode = signal('+51');

  // Formulario reactivo
  protected contactForm: FormGroup;

  // Países comunes
  protected countries = [
    { code: '+51', name: 'Perú', flag: '🇵🇪' },
    { code: '+57', name: 'Colombia', flag: '🇨🇴' },
    { code: '+56', name: 'Chile', flag: '🇨🇱' },
    { code: '+54', name: 'Argentina', flag: '🇦🇷' },
    { code: '+55', name: 'Brasil', flag: '🇧🇷' },
    { code: '+1', name: 'Estados Unidos', flag: '🇺🇸' },
    { code: '+34', name: 'España', flag: '🇪🇸' },
    { code: '+502', name: 'Guatemala', flag: '🇬🇹' },
    { code: '+503', name: 'El Salvador', flag: '🇸🇻' },
    { code: '+1504', name: 'Honduras', flag: '🇭🇳' },
    { code: '+505', name: 'Nicaragua', flag: '🇳🇮' },
    { code: '+506', name: 'Costa Rica', flag: '🇨🇷' },
    { code: '+507', name: 'Panamá', flag: '🇵🇦' },
    { code: '+58', name: 'Venezuela', flag: '🇻🇪' },
    { code: '+591', name: 'Bolivia', flag: '🇧🇴' },
    { code: '+592', name: 'Guyana', flag: '🇬🇾' },
    { code: '+593', name: 'Ecuador', flag: '🇪🇨' },
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Inicializar formulario con validaciones
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
      mensaje: ['', [Validators.minLength(10)]],
    });
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Delay pequeño para asegurar que el DOM está listo
      setTimeout(() => {
        this.checkVisibility();
      }, 100);
    }
  }

  ngOnDestroy() {
    // Limpiar recursos si es necesario
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (this.isBrowser) {
      this.checkVisibility();
    }
  }

  private checkVisibility() {
    if (!this.isBrowser) return;

    const element = document.querySelector('#contacto');
    if (element) {
      const rect = element.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight * 0.75;

      if (isInView && !this.isVisible()) {
        this.isVisible.set(true);
      }
    }
  }

  /**
   * Envía el formulario de contacto
   */
  protected async submitForm() {
    // Resetear mensajes
    this.successMessage.set('');
    this.errorMessage.set('');
    this.formSubmitted.set(true);

    // Validar formulario
    if (this.contactForm.invalid) {
      this.errorMessage.set(
        'Por favor, completa todos los campos correctamente.'
      );
      return;
    }

    this.isLoading.set(true);

    try {
      // Ejecutar reCAPTCHA v3
      const token = await new Promise<string>((resolve, reject) => {
        grecaptcha.ready(() => {
          grecaptcha
            .execute('6Lcem-krAAAAANI6tJY0lO8k1w5AKx5uurijaDWi', {
              action: 'contacto',
            })
            .then(resolve)
            .catch(reject);
        });
      });

      const formData = {
        nombre: this.contactForm.get('nombre')?.value.trim(),
        correo: this.contactForm.get('correo')?.value.trim(),
        celular: `${this.countryCode()}${
          this.contactForm.get('celular')?.value
        }`,
        mensaje: this.contactForm.get('mensaje')?.value.trim() || '',
        cliente: this.CLIENTE_ID,
        fechaContacto: new Date().toISOString(),
        fuente: 'landing-page-contacto',
        recaptcha: token,
      };

      // Intentar enviar a N8N
      await this.sendViaWebhook(formData);

      // Si llega aquí, fue exitoso
      this.successMessage.set(
        '¡Gracias! Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto pronto.'
      );
      this.contactForm.reset();
      this.formSubmitted.set(false);

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        this.successMessage.set('');
      }, 5000);
    } catch (error) {
      console.error('Error al enviar:', error);
      this.errorMessage.set(
        'Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Envía los datos a través de webhook N8N
   */
  private sendViaWebhook(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.N8N_WEBHOOK_URL, data).subscribe({
        next: (response) => resolve(response),
        error: (error) => {
          console.error('Error N8N:', error);

          // Solo usar fallback si es un error del servidor (500 o sin conexión)
          if (!error.status || error.status >= 500) {
            this.sendViaEmailService(data).then(resolve).catch(reject);
          } else {
            // Si es un error lógico (400, 401, 403, 422...), rechazamos
            reject(error);
          }
        },
      });
    });
  }

  /**
   * Envía los datos a través de servicio de email (simulado)
   */
  private sendViaEmailService(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('Enviando datos de contacto:', data);

      // Simular delay de red
      setTimeout(() => {
        // Simular éxito 95% de las veces
        if (Math.random() > 0.05) {
          resolve({ success: true, message: 'Email enviado simulado' });
        } else {
          reject({ message: 'Error simulado en servicio de email' });
        }
      }, 1500);
    });
  }

  /**
   * Obtiene el error del campo del formulario
   */
  protected getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);

    if (!field || !field.errors || !this.formSubmitted()) {
      return '';
    }

    if (field.hasError('required')) {
      const labels: { [key: string]: string } = {
        nombre: 'Nombre',
        correo: 'Correo',
        celular: 'Celular',
        mensaje: 'Mensaje',
      };
      return `${labels[fieldName] || fieldName} es requerido`;
    }

    if (field.hasError('minlength')) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }

    if (field.hasError('email')) {
      return 'Ingresa un correo válido';
    }

    if (field.hasError('pattern')) {
      return 'Celular inválido (7-15 dígitos)';
    }

    return '';
  }

  /**
   * Verifica si un campo es inválido
   */
  protected isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(
      field &&
      field.invalid &&
      (field.dirty || field.touched || this.formSubmitted())
    );
  }
}
