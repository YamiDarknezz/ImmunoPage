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
  selector: 'app-sport',
  imports: [CommonModule],
  templateUrl: './sport.html',
  styleUrl: './sport.scss',
})
export class Sport implements OnInit {
  private isBrowser: boolean = false;

  // Variable de entorno para WhatsApp
  private readonly WHATSAPP_NUMBER =
    _NGX_ENV_['NG_APP_WHATSAPP_NUMBER'] || '51987654321';

  protected isVisible = signal(false);
  protected imageLoaded = signal(false);

  // Ruta de la imagen
  protected sportImage = '/img/sport.png';

  // URL de YouTube embebida
  protected youtubeEmbedUrl: SafeResourceUrl;

  // Lista de características
  protected features: string[] = [
    'Precursor del glutatión',
    'Alto valor biológico / absorción',
    'Aislado de proteína de suero sin desnaturalizar con cisteína enlazada',
    'La mezcla exclusiva de citrulina y raíz de remolacha aumenta los niveles de óxido nítrico en el cuerpo',
    'Además, contiene cereza ácida, un conocido antiinflamatorio',
    'Contiene citrato de magnesio que ayuda a disminuir la cantidad de ácido láctico en el organismo',
    'Sin sabores ni edulcorantes artificiales',
    'No contiene antibióticos. Sin gluten. Sin OGM',
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sanitizer: DomSanitizer
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.youtubeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/uNO1aO4u4ss'
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
      '¡Hola! Quiero comprar Immunocal Sport y mejorar mi rendimiento deportivo.'
    );
    const url = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');
  }
}
