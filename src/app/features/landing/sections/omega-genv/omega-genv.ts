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

interface Benefit {
  text: string;
  icon: string;
}

@Component({
  selector: 'app-omega-genv',
  imports: [CommonModule],
  templateUrl: './omega-genv.html',
  styleUrl: './omega-genv.scss',
})
export class OmegaGenv implements OnInit {
  private isBrowser: boolean = false;

  // Variable de entorno para WhatsApp
  private readonly WHATSAPP_NUMBER =
    _NGX_ENV_['NG_APP_WHATSAPP_NUMBER'] || '51987654321';

  protected isVisible = signal(false);
  protected imageLoaded = signal(false);

  // Ruta de la imagen
  protected omegaImage = '/img/omega.png';

  // Lista de beneficios con emojis
  protected benefits: Benefit[] = [
    {
      text: 'Apoya la salud cardiovascular',
      icon: '❤️',
    },
    {
      text: 'Apoya la salud cognitiva',
      icon: '🧠',
    },
    {
      text: 'Apoya la salud ocular',
      icon: '👁️',
    },
    {
      text: 'Combatir la inflamación celular',
      icon: '⚡',
    },
    {
      text: 'Refuerzo al sistema inmunológico',
      icon: '🛡️',
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
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

    const element = document.querySelector('#omega-genv');
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
      '¡Hola! Quiero comprar Omega Gen V y conocer más sobre sus beneficios.'
    );
    const url = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');
  }
}
