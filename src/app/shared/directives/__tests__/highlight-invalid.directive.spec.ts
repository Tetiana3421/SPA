import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { HighlightInvalidDirective } from '../../directives/highlight-invalid.directive';

@Component({
  template: `<form [formGroup]="form"><input highlightInvalid formControlName="name" /></form>`,
  standalone: true,
  imports: [ReactiveFormsModule, HighlightInvalidDirective]
})
class HostComponent {
  form = new FormGroup({ name: new FormControl('', [Validators.required, Validators.minLength(2)]) });
}

describe('HighlightInvalidDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    fixture = await TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('applies red border on blur when invalid', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('blur'));
    expect(input.style.borderColor).toBe('crimson');
  });
});