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
  selector: 'app-oportunidad-negocio',
  imports: [CommonModule],
  templateUrl: './oportunidad-negocio.html',
  styleUrl: './oportunidad-negocio.scss',
})
export class OportunidadNegocio implements OnInit {
  private isBrowser: boolean = false;

  // Variable de entorno para WhatsApp
  private readonly WHATSAPP_NUMBER =
    _NGX_ENV_['NG_APP_WHATSAPP_NUMBER'] || '51987654321';

  protected isVisible = signal(false);
  protected videoUrl: SafeResourceUrl;
  protected isVideoPlaying = signal(false);

  // Beneficios destacados
  protected benefits = [
    {
      id: 1,
      icon: 'star',
      text: 'Productos de primera calidad',
    },
    {
      id: 2,
      icon: 'graduation',
      text: 'Capacitación de clase mundial',
    },
    {
      id: 3,
      icon: 'money',
      text: 'Plan de compensación generoso',
    },
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sanitizer: DomSanitizer
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Video de YouTube embebido con API para detectar reproducción
    const videoId = '-YPTcxgnJBY';
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`
    );
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.checkVisibility();
      this.setupYouTubeAPI();
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

    const element = document.querySelector('#oportunidad-negocio');
    if (element) {
      const rect = element.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight * 0.75;

      if (isInView && !this.isVisible()) {
        this.isVisible.set(true);
      }
    }
  }

  private setupYouTubeAPI() {
    if (!this.isBrowser) return;

    // Cargar API de YouTube para detectar cuando se reproduce el video
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Configurar listener cuando la API esté lista
    (window as any).onYouTubeIframeAPIReady = () => {
      // La API está lista, los eventos se manejarán en el iframe
    };
  }

  protected onVideoFrameClick() {
    // Cuando se hace click en el video, asumimos que se está reproduciendo
    // y ocultamos el overlay decorativo
    this.isVideoPlaying.set(true);
  }

  protected contactWhatsApp() {
    if (!this.isBrowser) return;

    const message = encodeURIComponent(
      '¡Hola! Quiero unirme a la familia Immunotec y conocer más sobre esta oportunidad de negocio.'
    );
    const url = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');
  }

  // Método auxiliar para obtener el SVG del icono
  protected getIconPath(iconType: string): string {
    const icons: { [key: string]: string } = {
      star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
      graduation:
        'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14l-9-5v7.5A2.5 2.5 0 005.5 19h13a2.5 2.5 0 002.5-2.5V9l-9 5z',
      money:
        'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    };
    return icons[iconType] || icons['star'];
  }
}
