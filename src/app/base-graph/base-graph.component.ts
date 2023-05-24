import { Component, Input } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { BaseScrollComponent } from '../base-scroll/base-scroll.component';

@Component({
  selector: 'app-base-graph',
  templateUrl: './base-graph.component.html',
  styleUrls: ['./base-graph.component.css']
})
export class BaseGraphComponent extends BaseScrollComponent{
  @Input()
  graphName:string = ""

  constructor(public apiService: ApiServiceService){
    super();
  }

  svg: any;
  svgData: any;

  width = 0
  height = 0

  x: any
  y: any
  
  margin = {top: 0, right: 0, bottom: 0, left: 0}
  
}
