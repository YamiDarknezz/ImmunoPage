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
  selector: 'app-negocio-consumidores',
  imports: [CommonModule],
  templateUrl: './negocio-consumidores.html',
  styleUrl: './negocio-consumidores.scss',
})
export class NegocioConsumidores implements OnInit {
  private isBrowser: boolean = false;

  // Variable de entorno para WhatsApp
  private readonly WHATSAPP_NUMBER =
    _NGX_ENV_['NG_APP_WHATSAPP_NUMBER'] || '51987654321';

  protected isVisible = signal(false);
  protected imageLoaded = signal(false);

  // Ruta de la imagen
  protected meditandoImage = '/img/meditando.png';

  // Highlights del contenido
  protected highlights = [
    {
      id: 1,
      icon: 'wellness',
      title: 'Bienestar y Energía',
      description: 'Productos de alta calidad para el estilo de vida',
    },
    {
      id: 2,
      icon: 'compensation',
      title: 'Plan Generoso',
      description: 'Uno de los mejores planes de compensación del mercado',
    },
    {
      id: 3,
      icon: 'team',
      title: 'Equipo de Apoyo',
      description: 'Consultores experimentados te guiarán en cada paso',
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

    const element = document.querySelector('#negocio-consumidores');
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
      '¡Hola! Quiero empezar mi negocio con Immunotec. ¿Pueden brindarme más información sobre cómo iniciar?'
    );
    const url = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');
  }

  // Método auxiliar para obtener el SVG del icono
  protected getIconPath(iconType: string): string {
    const icons: { [key: string]: string } = {
      wellness: 'M4.5 12.75l6 6 9-13.5 M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      compensation:
        'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      team: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
    };
    return icons[iconType] || icons['wellness'];
  }
}
