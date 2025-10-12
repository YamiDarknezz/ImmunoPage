import {
  Component,
  signal,
  OnInit,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-sobre-immunotec',
  imports: [CommonModule],
  templateUrl: './sobre-immunotec.html',
  styleUrl: './sobre-immunotec.scss',
})
export class SobreImmunotec implements OnInit {
  private isBrowser: boolean = false;

  // Variable de entorno para WhatsApp
  private readonly WHATSAPP_NUMBER = _NGX_ENV_['NG_APP_WHATSAPP_NUMBER'];

  protected isVisible = signal(false);
  protected videoUrl: SafeResourceUrl;

  // Estadísticas animadas
  protected stats = [
    {
      number: 45,
      suffix: '+',
      label: 'Años de Investigación',
      animated: signal(0),
    },
    { number: 14, suffix: '', label: 'Países', animated: signal(0) },
    { number: 100, suffix: '%', label: 'Dedicación', animated: signal(0) },
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sanitizer: DomSanitizer
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Video de YouTube embebido
    const videoId = 'EK1KTgVgV10';
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
    );
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Aquí ya puedes usar document o window
      this.checkVisibility();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) this.checkVisibility();
  }

  private checkVisibility() {
    if (!this.isBrowser) return;
    const element = document.querySelector('#quienes-somos');
    if (element) {
      const rect = element.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight * 0.75;

      if (isInView && !this.isVisible()) {
        this.isVisible.set(true);
        this.animateStats();
      }
    }
  }

  private animateStats() {
    this.stats.forEach((stat, index) => {
      setTimeout(() => {
        this.animateNumber(stat);
      }, index * 200);
    });
  }

  private animateNumber(stat: any) {
    const duration = 2000;
    const steps = 60;
    const increment = stat.number / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= stat.number) {
        stat.animated.set(stat.number);
        clearInterval(timer);
      } else {
        stat.animated.set(Math.floor(current));
      }
    }, duration / steps);
  }

  protected contactWhatsApp() {
    const message = encodeURIComponent(
      '¡Hola! Me interesa conocer más sobre Immunotec.'
    );
    const url = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');
  }

  protected get whatsappDisplay(): string {
    // Formato visual del número
    return `+${this.WHATSAPP_NUMBER.slice(0, 2)} ${this.WHATSAPP_NUMBER.slice(
      2,
      5
    )} ${this.WHATSAPP_NUMBER.slice(5, 8)} ${this.WHATSAPP_NUMBER.slice(8)}`;
  }
}
