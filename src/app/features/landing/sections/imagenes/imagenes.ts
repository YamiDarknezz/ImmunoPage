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

interface ImageData {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
  badgeText: string;
  icon: string;
}

@Component({
  selector: 'app-imagenes',
  imports: [CommonModule],
  templateUrl: './imagenes.html',
  styleUrl: './imagenes.scss',
})
export class Imagenes implements OnInit {
  private isBrowser: boolean = false;

  protected isVisible = signal(false);
  protected imageLoaded = signal<boolean[]>([false, false]);

  protected images: ImageData[] = [
    {
      id: 1,
      src: '/img/inmunocal-numeros.jpg',
      alt: 'Immunocal en números - Estadísticas y datos relevantes',
      title: 'Immunocal en Números',
      description:
        'Datos que respaldan nuestra trayectoria y compromiso con la excelencia',
      badgeText: 'Estadísticas',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', // Chart bar icon
    },
    {
      id: 2,
      src: '/img/nuestro-proposito.jpg',
      alt: 'Nuestro propósito - Misión y visión de Immunotec',
      title: 'Nuestro Propósito',
      description: 'La misión que nos impulsa a transformar vidas cada día',
      badgeText: 'Misión',
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', // Globe icon
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

    const element = document.querySelector('#imagenes');
    if (element) {
      const rect = element.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight * 0.75;

      if (isInView && !this.isVisible()) {
        this.isVisible.set(true);
      }
    }
  }

  protected onImageLoad(index: number) {
    const currentState = this.imageLoaded();
    const newState = [...currentState];
    newState[index] = true;
    this.imageLoaded.set(newState);
  }
}
