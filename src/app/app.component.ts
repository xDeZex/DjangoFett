import { Component } from '@angular/core';
import { Subject, fromEvent, takeUntil } from 'rxjs';
import { ScrollService } from './scroll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'djangofettSite';

  destroy = new Subject();
	
	destroy$ = this.destroy.asObservable();
    
	constructor(scrollService: ScrollService) {
		fromEvent(window, 'scroll').pipe(takeUntil(this.destroy$))
			.subscribe((e: Event) => scrollService.updateScrollY(window.scrollY));
	}

	ngOnDestroy(): void {
	    this.destroy.complete()
	}
}
