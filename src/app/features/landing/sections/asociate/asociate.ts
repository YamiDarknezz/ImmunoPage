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

@Component({
  selector: 'app-asociate',
  imports: [CommonModule],
  templateUrl: './asociate.html',
  styleUrl: './asociate.scss',
})
export class Asociate implements OnInit {
  private isBrowser: boolean = false;

  // Variable de entorno para WhatsApp
  private readonly WHATSAPP_NUMBER = _NGX_ENV_['NG_APP_WHATSAPP_NUMBER'];

  protected isVisible = signal(false);
  protected imageLoaded = signal(false);

  // Datos del CEO
  protected ceoInfo = {
    name: 'Mauricio Domenzain',
    title: 'CEO Immunotec',
    image: '/img/ceo.png',
  };

  // Tarjetas de oficinas
  protected offices = [
    {
      id: 1,
      name: 'México',
      image: '/img/mexico.png',
      location: 'Ciudad de México',
    },
    {
      id: 2,
      name: 'Houston',
      image: '/img/houston.png',
      location: 'Texas, USA',
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

    const element = document.querySelector('#asociate');
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
      '¡Hola! Quiero ser parte de Immunotec y conocer más sobre la oportunidad de negocio.'
    );
    const url = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');
  }
}
