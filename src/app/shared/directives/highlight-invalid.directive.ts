import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({ selector: '[highlightInvalid]', standalone: true })
export class HighlightInvalidDirective {
  private el = inject(ElementRef);
  private ngControl = inject(NgControl, { optional: true });

  @HostListener('blur')
  onBlur() {
    const invalid = this.ngControl?.invalid && (this.ngControl?.touched || this.ngControl?.dirty);
    (this.el.nativeElement as HTMLElement).style.borderColor = invalid ? 'crimson' : '';
  }
}