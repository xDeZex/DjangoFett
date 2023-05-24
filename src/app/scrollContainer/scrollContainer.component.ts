import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ScrollService } from '../scroll.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-scrollContainer',
  templateUrl: './scrollContainer.component.html',
  styleUrls: ['./scrollContainer.component.css']
})
export class ClockScrollComponent {
  @ViewChild('clock', {static: true, read: ElementRef}) clockContainer!: ElementRef
  private subscription?: Subscription

  constructor(private scrollService: ScrollService){}

  scroll: number = 0

  windowHeight: number = 0

  ngOnInit() {
    this.subscription = this.scrollService.scrollY$.subscribe((res) => {
      this.scroll = res
    });
    this.windowHeight = window.innerHeight
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
