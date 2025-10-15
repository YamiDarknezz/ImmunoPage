import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-hero-video',
  templateUrl: './hero-video.html',
  styleUrl: './hero-video.scss',
})
export class HeroVideo implements AfterViewInit {
  @ViewChild('videoIframe') videoIframe!: ElementRef<HTMLIFrameElement>;
  isMuted = true;

  ngAfterViewInit() {
    // Asegurarse de que el iframe esté listo
    setTimeout(() => {
      this.isMuted = true;
    }, 1000);
  }

  toggleAudio() {
    this.isMuted = !this.isMuted;
    const iframe = this.videoIframe.nativeElement;

    // Usamos postMessage API para controlar YouTube iframe
    const message = {
      event: 'command',
      func: this.isMuted ? 'mute' : 'unMute',
    };

    iframe.contentWindow?.postMessage(JSON.stringify(message), '*');
  }
}
