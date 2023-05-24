import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  
  scrollY = new BehaviorSubject(0);
  scrollY$ = this.scrollY.asObservable();

  constructor() { }

  updateScrollY(value: number): void {
    this.scrollY.next(value);
  }

  getScrollY(): number {
    return this.scrollY.value
  }

}
