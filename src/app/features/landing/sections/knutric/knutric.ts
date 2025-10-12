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
  selector: 'app-knutric',
  imports: [CommonModule],
  templateUrl: './knutric.html',
  styleUrl: './knutric.scss',
})
export class Knutric implements OnInit {
  private isBrowser: boolean = false;

  // Variable de entorno para WhatsApp
  private readonly WHATSAPP_NUMBER =
    _NGX_ENV_['NG_APP_WHATSAPP_NUMBER'] || '51987654321';

  protected isVisible = signal(false);
  protected imageLoaded = signal(false);

  // Ruta de la imagen
  protected knutricImage = '/img/knutric.png';

  // URL de YouTube embebida
  protected youtubeEmbedUrl: SafeResourceUrl;

  // Lista de características
  protected features: string[] = [
    'Más un complejo mineral que incluye potasio, yodo, magnesio y boro',
    'Sin sabores artificiales ni edulcorantes',
    'Ingredientes con respaldo científico',
    'Con 6 ingredientes ricos en compuestos bioactivos que incluyen: Acai, acerola, arándano, espirulina, brócoli, y hongo shiitake',
    'La mezcla de hierbas también incluye extractos de manzanilla, tomillo, semillas de apio y alfalfa',
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sanitizer: DomSanitizer
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.youtubeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/fXed5ODpWgQ'
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

    const element = document.querySelector('#sport');
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
      '¡Hola! Quiero comprar Knutric + y fortalece mi sistema.'
    );
    const url = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');
  }
}
