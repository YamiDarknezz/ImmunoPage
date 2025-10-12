import { Component, Input, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  @Input() isScrolled = false;

  protected menuAbierto = signal(false);
  protected scrolled = signal(false);

  protected readonly menuItems = [
    { id: 1, label: 'Quiénes Somos', href: '#quienes-somos' },
    { id: 2, label: 'Immunocal', href: '#fortalece-sistema' },
    { id: 3, label: 'Ciencia', href: '#ciencia-detras' },
    { id: 4, label: 'Platinum', href: '#platinum' },
    { id: 5, label: 'Oportunidad', href: '#oportunidad' },
    { id: 6, label: 'Contáctanos', href: '#contacto' },
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled.set(window.scrollY > 20);
  }

  toggleMenu() {
    this.menuAbierto.update((state) => !state);
    // Prevenir scroll cuando el menú está abierto
    if (!this.menuAbierto()) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }

  closeMenu() {
    this.menuAbierto.set(false);
    document.body.style.overflow = 'auto';
  }

  navigateTo(event: Event, href: string) {
    event.preventDefault();
    this.closeMenu();

    const element = document.querySelector(href);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }
}
