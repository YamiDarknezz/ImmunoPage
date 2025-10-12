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

interface Scientist {
  id: number;
  name: string;
  image: string;
}

interface Advisor {
  image: string;
  name: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-ciencia-detras',
  imports: [CommonModule],
  templateUrl: './ciencia-detras.html',
  styleUrl: './ciencia-detras.scss',
})
export class CienciaDetras implements OnInit {
  private isBrowser: boolean = false;

  protected isVisible = signal(false);
  protected imageLoaded = signal<boolean[]>([false, false, false, false]);

  // Científicos principales
  protected mainScientists: Scientist[] = [
    {
      id: 1,
      name: 'Dr. Gustavo Bounous',
      image: '/img/cientifico-1.png',
    },
    {
      id: 2,
      name: 'Dra. Patricia Kongshavn',
      image: '/img/cientifico-2.png',
    },
  ];

  // Asesor médico
  protected advisor: Advisor = {
    image: '/img/cientifico-3.png',
    name: 'Dr. Jimmy Gutman',
    title: 'Dr. Jimmy Gutman',
    description:
      'Asesor Médico Principal de Immunotec, experto mundialmente conocido por el tema del glutatión y autor de los libros sobre este tema.',
  };

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

    const element = document.querySelector('#ciencia-detras');
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
