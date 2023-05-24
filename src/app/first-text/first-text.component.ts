import { Component, ElementRef, ViewChild } from '@angular/core';
import { BaseTextComponent } from '../base-text/base-text.component';

@Component({
  selector: 'app-first-text',
  templateUrl: './first-text.component.html',
  styleUrls: ['./first-text.component.css', '../scrollContainer/scrollContainer.component.css']
})
export class FirstTextComponent extends BaseTextComponent{

  
  @ViewChild('konj', {static: true, read: ElementRef}) konjContainer!: ElementRef
  
  height = 0
  width = 0
  ngOnViewInit(){
    this.width = this.konjContainer.nativeElement.offsetWidth
    this.height = this.konjContainer.nativeElement.offsetHeight
  }

}
