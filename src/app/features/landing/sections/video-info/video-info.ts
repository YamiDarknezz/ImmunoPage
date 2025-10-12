import {
  Component,
  signal,
  OnInit,
  OnDestroy,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Stat {
  id: number;
  number: number;
  suffix: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-video-info',
  imports: [CommonModule],
  templateUrl: './video-info.html',
  styleUrl: './video-info.scss',
})
export class VideoInfo implements OnInit, OnDestroy {
  private isBrowser: boolean = false;
  private animationFrameId?: number;
  private hasAnimated = false;

  protected isVisible = signal(false);
  protected animatedNumbers = signal<number[]>([0, 0, 0]);
  protected videoUrl: SafeResourceUrl;

  protected stats: Stat[] = [
    {
      id: 1,
      number: 394,
      suffix: 'millones',
      label: 'de porciones vendidas',
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', // Shopping bag icon
    },
    {
      id: 2,
      number: 36,
      suffix: 'años',
      label: 'de investigación',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', // Shield check icon
    },
    {
      id: 3,
      number: 62,
      suffix: 'patentes',
      label: 'emitidas',
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', // Badge check icon
    },
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sanitizer: DomSanitizer
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Convertir URL de YouTube a formato embed
    const youtubeId = '1VVkdtGUdgo';
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.checkVisibility();
    }
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
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

    const element = document.querySelector('#video-info');
    if (element) {
      const rect = element.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight * 0.75;

      if (isInView && !this.isVisible()) {
        this.isVisible.set(true);

        // Iniciar animación de números solo una vez
        if (!this.hasAnimated) {
          this.hasAnimated = true;
          this.animateNumbers();
        }
      }
    }
  }

  private animateNumbers() {
    const duration = 2000; // 2 segundos
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = duration / frameRate;

    let currentFrame = 0;

    const animate = () => {
      currentFrame++;
      const progress = currentFrame / totalFrames;

      // Easing function (ease-out)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const newNumbers = this.stats.map((stat) =>
        Math.floor(stat.number * easeOutQuart)
      );

      this.animatedNumbers.set(newNumbers);

      if (currentFrame < totalFrames) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        // Asegurar que los números finales sean exactos
        this.animatedNumbers.set(this.stats.map((stat) => stat.number));
      }
    };

    if (this.isBrowser) {
      this.animationFrameId = requestAnimationFrame(animate);
    }
  }
}
