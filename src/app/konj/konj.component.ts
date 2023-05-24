import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { konjModel } from '../konjModel';
import * as d3 from 'd3';
import { BaseGraphComponent } from '../base-graph/base-graph.component';

@Component({
  selector: 'app-konj',
  templateUrl: './konj.component.html',
  styleUrls: ['./konj.component.css']
})
export class KonjComponent extends BaseGraphComponent {
  @ViewChild('konj', {static: true, read: ElementRef}) konjContainer!: ElementRef


  
  konj: konjModel = {
    indicator: []
  }

  private GPath: Object = {}
  @Input() inputWidth = 0
  @Input() inputHeight = 0

  
  override margin = {top: 10, right: 10, bottom: 60, left: 40}
  

  override x = d3.scaleTime()

  override y = d3.scaleLinear()
    .clamp(true)

  ngAfterViewInit(){
    let ret = this.apiService.getIndicator();

    this.width = this.konjContainer.nativeElement.offsetWidth - this.margin.left - this.margin.right,
    this.height = this.konjContainer.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;

    this.createSvg()

    ret.subscribe(data => {
      console.log(data);
      for (let d in data["indicator"]){

        this.konj.indicator.push([new Date(d), data["indicator"][d]]);
      }

      this.x
       .domain([this.konj.indicator[0][0], this.konj.indicator[this.konj.indicator.length - 1][0]])
      

      this.updateScale()
      this.drawGraph()
    })
  }

  updateScale() {

    let maxY = -999
    let minY = 999
    for (let i = 0; i < this.konj.indicator.length; i++) {
      let tempAT = Math.abs(this.konj.indicator[i][1])
      if (tempAT !== -999 && tempAT !== 999) {
        if (tempAT > maxY) {
          maxY = tempAT
        }
        if (tempAT < minY) {
          minY = tempAT
        }
      }
    }
    
    if (maxY !== -999) {
      this.y.domain([minY, maxY])
    }

    this.x.range([0, this.width])
    this.y.range([this.height, 0])

    let xAxis = d3.axisBottom(this.x).ticks(this.konj.indicator[this.konj.indicator.length - 1][0].getFullYear() - this.konj.indicator[0][0].getFullYear())
    let yAxis = d3.axisLeft(this.y.domain([minY/2, maxY + 10]));

    this.svgData.append("g")
      .attr("transform", `translate(0, ${this.height})`)
      .call(xAxis)
      .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-60)");

    this.svgData.append("g")
      .call(yAxis)
      

  }
  drawGraph(){
    let dots = this.svgData
      .attr("class", "konj")
    this.GPath = dots
      .append("path")
        .datum(this.konj.indicator)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x((d) => { return this.x(d[0]) })
          .y((d) => { return this.y(d[1]) })
      )

      
  }

  private createSvg(): void {
    
    this.svg = d3.select("figure#konj")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
    
    this.svgData = this.svg.append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`)
      .append('g');
      
    this.svgData.append("text")
      .attr("x", (this.width / 2))             
      .attr("y", +this.margin.top)
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("text-decoration", "underline")  
      .text("Konjuktur");
  }
}
