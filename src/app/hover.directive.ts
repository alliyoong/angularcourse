import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, OnInit, Inject, Renderer2, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[hinvHover]'
})
export class HoverDirective implements OnInit{
  @Input() color: string = 'red';
  // @Input() hinvHover: string = 'red';  // same name as selector

  constructor(private element: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document) { 
    console.log(this.element.nativeElement);
  }
  ngOnInit(): void {
    // this.element.nativeElement.style.backgroundColor = this.color;
    this.renderer.setStyle(
      this.element.nativeElement,
      'backgroundColor',
      this.color
    );
  }

  @HostListener('mouseenter') onMouseEnter(){
    this.renderer.setStyle(
      this.element.nativeElement,
      'backgroundColor',
      'green'
    );
  }
  
  @HostListener('mouseleave') onMouseLeave(){
    this.renderer.setStyle(
      this.element.nativeElement,
      'backgroundColor',
      'white'
    );
  }
}
