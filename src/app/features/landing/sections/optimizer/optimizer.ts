import {
  Component,
  signal,
  OnInit,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-optimizer',
  imports: [CommonModule],
  templateUrl: './optimizer.html',
  styleUrl: './optimizer.scss',
})
export class Optimizer implements OnInit {
  private isBrowser: boolean = false;

  // Variable de entorno para WhatsApp
  private readonly WHATSAPP_NUMBER =
    _NGX_ENV_['NG_APP_WHATSAPP_NUMBER'] || '51987654321';

  protected isVisible = signal(false);
  protected imageLoaded = signal(false);

  // Ruta de la imagen
  protected optimizerImage = '/img/optimizer.png';

  // URL de YouTube embebida
  protected youtubeEmbedUrl: SafeResourceUrl;

  // Lista de beneficios
  protected benefits: string[] = [
    'Complemento perfecto para Immunocal® e Immunocal Platinum®.',
    'Apoya los antioxidantes incluyendo el glutatión.',
    'Más de 50 frutas y verduras orgánicas.',
    'Ingredientes clínicamente estudiados.',
    'Además de un delicioso sabor cítrico de frutos rojos.',
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sanitizer: DomSanitizer
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.youtubeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/aOxNjYQ2Osk'
    );
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.checkVisibility();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      this.checkVisibility();
    }
  }

  private checkVisibility() {
    if (!this.isBrowser) return;

    const element = document.querySelector('#optimizer');
    if (element) {
      const rect = element.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight * 0.75;

      if (isInView && !this.isVisible()) {
        this.isVisible.set(true);
      }
    }
  }

  protected onImageLoad() {
    this.imageLoaded.set(true);
  }

  protected contactWhatsApp() {
    if (!this.isBrowser) return;

    const message = encodeURIComponent(
      '¡Hola! Quiero comprar Immunocal Optimizer y complementar mi régimen con Immunocal.'
    );
    const url = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');
  }
}
