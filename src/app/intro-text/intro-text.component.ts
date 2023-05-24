import { Component} from '@angular/core';
import { BaseScrollComponent } from '../base-scroll/base-scroll.component';
import { BaseTextComponent } from '../base-text/base-text.component';

@Component({
  selector: 'app-intro-text',
  templateUrl: './intro-text.component.html',
  styleUrls: ['./intro-text.component.css', '../scrollContainer/scrollContainer.component.css']
})

export class IntroTextComponent extends BaseTextComponent {
  
  
}
