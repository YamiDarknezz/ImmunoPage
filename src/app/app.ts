import {
  Component,
  signal,
  OnInit,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Navbar } from './core/components/navbar/navbar';
import { Landing } from './features/landing/landing';
import { Footer } from './core/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Navbar, Landing, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('immunocal-landing');
  protected scrolled = signal(false);
  private isBrowser: boolean;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isBrowser) return; // <-- protección
    this.scrolled.set(window.scrollY > 50);
  }

  ngOnInit() {
    this.titleService.setTitle(
      'Immunocal | Suplemento Natural para tu Bienestar'
    );
    this.metaService.addTags([
      {
        name: 'description',
        content:
          'Immunocal fortalece tu sistema inmunológico de manera natural. Descubre el poder del glutatión para tu salud y bienestar.',
      },
      {
        name: 'keywords',
        content:
          'immunocal, glutatión, sistema inmunológico, suplemento natural, salud, bienestar, immunotec',
      },
      { property: 'og:title', content: 'Immunocal | Suplemento Natural' },
      {
        property: 'og:description',
        content:
          'Immunocal fortalece tu sistema inmunológico de manera natural',
      },
      { property: 'og:image', content: '/img/og-image.jpg' },
      { property: 'og:type', content: 'website' },
      { name: 'theme-color', content: '#0132A3' },
    ]);
  }
}
