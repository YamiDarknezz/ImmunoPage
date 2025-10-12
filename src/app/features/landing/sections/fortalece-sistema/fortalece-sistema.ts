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

interface IdeaItem {
  id: number;
  letter: string;
  title: string;
}

@Component({
  selector: 'app-fortalece-sistema',
  imports: [CommonModule],
  templateUrl: './fortalece-sistema.html',
  styleUrl: './fortalece-sistema.scss',
})
export class FortaleceSistema implements OnInit {
  private isBrowser: boolean = false;

  // Variable de entorno para WhatsApp
  private readonly WHATSAPP_NUMBER =
    _NGX_ENV_['NG_APP_WHATSAPP_NUMBER'] || '51987654321';

  protected isVisible = signal(false);
  protected imageLoaded = signal(false);

  // Items IDEA
  protected ideaItems: IdeaItem[] = [
    {
      id: 1,
      letter: 'I',
      title: 'Inmunológico',
    },
    {
      id: 2,
      letter: 'D',
      title: 'Desintoxicador',
    },
    {
      id: 3,
      letter: 'E',
      title: 'Energía Celular',
    },
    {
      id: 4,
      letter: 'A',
      title: 'Antioxidante Maestro',
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

    const element = document.querySelector('#fortalece-sistema');
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
      '¡Hola! Quiero comprar el producto Immunocal. ¿Me pueden brindar más información?'
    );
    const url = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');
  }
}
