import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Directive({
  selector: '[appHoverHighlight]',
  standalone: true,
})
export class HoverHighlightDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', '#f0f8ff'); // couleur légère bleue
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.removeStyle(this.el.nativeElement, 'background-color');
  }
}
