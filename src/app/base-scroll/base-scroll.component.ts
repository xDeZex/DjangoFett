import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-scroll',
  templateUrl: './base-scroll.component.html',
  styleUrls: ['./base-scroll.component.css']
})
export class BaseScrollComponent {

  @Input() scroll: number = 0
  scrollLast: number = 0
  scrollFraction: number = 0

  @Input() scrollLower: number  = 0
  @Input() scrollUpper: number = 0

  fixed: boolean = false
  top: number = 0

  Yoffset: number = 0
  heightComponent: number = 0

  @Input() rightFixed: boolean = false
  @Input() leftFixed: boolean = false

  @Input() overhang: number = 0

  ngOnInit(){
    this.heightComponent = this.scrollUpper - this.scrollLower
  }

  scrollUpdate() {
    if (this.scroll < this.scrollUpper && this.scroll >= this.scrollLower) {
      this.fixed = true
      this.top = 0
    }
    else if(this.scroll >= this.scrollUpper){
      this.fixed = false
      this.top = this.scrollUpper - this.Yoffset
    } 
    else{
      this.fixed = false
      this.top = this.scrollLower + this.Yoffset
    }

    this.scrollLast = this.scroll
    this.scrollFraction = ((this.scroll - this.scrollLower) / (this.scrollUpper - this.overhang - this.scrollLower));
    this.scrollFraction = Math.max(Math.min(this.scrollFraction, 1), 0);
  }

}
