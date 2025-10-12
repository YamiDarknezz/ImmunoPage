import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected currentYear = new Date().getFullYear();

  protected openGitHub() {
    window.open('https://github.com/YamiDarknezzv', '_blank');
  }
}
