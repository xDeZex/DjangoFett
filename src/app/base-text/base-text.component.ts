import { Component } from '@angular/core';
import { BaseScrollComponent } from '../base-scroll/base-scroll.component';

@Component({
  selector: 'app-base-text',
  templateUrl: './base-text.component.html',
  styleUrls: ['./base-text.component.css']
})
export class BaseTextComponent extends BaseScrollComponent {

  ngOnChanges(){
    this.Yoffset = this.heightComponent
    this.scrollUpdate()
    if(this.scroll > this.scrollLower && this.scroll < this.scrollUpper) {
      this.top = this.scrollLower - this.scroll
    }
    else if(this.scroll < this.scrollLower) {
      this.top = this.scrollLower
    }
  }

}
