import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appResizeColumn]',
})
export class ResizeColumnDirective {
  private resizing = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    const cell = this.el.nativeElement;
    const startX = event.clientX;
    const startWidth = cell.offsetWidth;

    this.resizing = true;

    const mouseMoveListener = (e: MouseEvent) => {
      if (!this.resizing) return;

      const newWidth = startWidth + (e.clientX - startX);
      this.renderer.setStyle(cell, 'width', newWidth + 'px');
    };

    const mouseUpListener = () => {
      this.resizing = false;
      window.removeEventListener('mousemove', mouseMoveListener);
      window.removeEventListener('mouseup', mouseUpListener);
    };

    window.addEventListener('mousemove', mouseMoveListener);
    window.addEventListener('mouseup', mouseUpListener);
  }
}
