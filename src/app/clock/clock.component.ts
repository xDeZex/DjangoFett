import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { clockModel } from '../clockModel';
import * as d3 from 'd3';
import { BaseScrollComponent } from '../base-scroll/base-scroll.component';
import { BaseGraphComponent } from '../base-graph/base-graph.component';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css', '../scrollContainer/scrollContainer.component.css']
})
export class ClockComponent extends BaseGraphComponent{
  @ViewChild('clock', {static: true, read: ElementRef}) clockContainer!: ElementRef
  

  @Input() scrollMonthLower: string | null = null
  @Input() scrollMonthUpper: string | null = null
  @Input() scrollDisplayGap: number | null = null

  lowerMonth:number = 0
  upperMonth:number = 0

  monthFirst: string | null = null
  monthLast: string | null = null



  override x = d3.scaleLinear()
      .domain([3, -3])
      .range([0, this.width ])
      .clamp(true)

  override y = d3.scaleLinear()
    .domain([-3, 3])
    .range([this.height, 0])
    .clamp(true)

  private opacity = d3.scaleLinear()
    .range([0.2, 1])
    .clamp(true)

  zip = (a: Array<any>, b: Array<any>) => a.map((k, i) => [k, b[i]]);
  
  colors = {
    "ArbetadeTimmar": "#003f5c",
    "Detaljhandel": "#003f5c",
    "BNPKvartal": "#374c80",
    "BNPMånad": "#374c80",
    "HushållensKonfindens": "#bc5090",
    "HushållensKonsumtion": "#bc5090",
    "Sysselsättning": "#ef5675",
    "IndustrinsOrderingång": "#ef5675",
    "Lastbilar": "#ff764a",
    "Personbilar": "#ff764a",
    "NäringslivetsEfterfrågan": "#7a5195",
    "NäringslivetsProduktion": "#7a5195",
    "Varuexport": "#ffa600",
    "Varuimport": "#ffa600",
  }
  shapes = {
    "ArbetadeTimmar": 2,
    "Detaljhandel": 3,
    "Sysselsättning": 4,
    "IndustrinsOrderingång": 5,
    "BNPKvartal": 0,
    "BNPMånad": 1,
    "HushållensKonfindens": 0,
    "HushållensKonsumtion": 1,
    "Lastbilar": 0,
    "Personbilar": 1,
    "NäringslivetsEfterfrågan": 0,
    "NäringslivetsProduktion": 1,
    "Varuexport": 0,
    "Varuimport": 1,
  }

  tempdisplayIndexes = {
    "ArbetadeTimmar": true,
    "Detaljhandel": true,
    "Sysselsättning": true,
    "IndustrinsOrderingång": true,
    "BNPKvartal": true,
    "BNPMånad": true,
    "HushållensKonfindens": true,
    "HushållensKonsumtion": true,
    "Lastbilar": true,
    "Personbilar": true,
    "NäringslivetsEfterfrågan": true,
    "NäringslivetsProduktion": true,
    "Varuexport": true,
    "Varuimport": true,
  }

  displayIndexes = new Map(Object.entries(this.tempdisplayIndexes));

  GPaths = new Map<string, Object>();
  

  clock: clockModel = {
    ArbetadeTimmar: [], 
    BNPKvartal: [], 
    BNPMånad: [], 
    Detaljhandel: [],
    HushållensKonfindens: [], 
    HushållensKonsumtion: [], 
    IndustrinsOrderingång: [],
    Lastbilar: [], 
    Personbilar: [], 
    NäringslivetsEfterfrågan: [], 
    NäringslivetsProduktion: [], 
    Sysselsättning: [], 
    Varuexport: [], 
    Varuimport: [],
  };

  timeSeries: Array<string>= []

  ngOnChanges(){
    this.scrollUpdate()
    if(this.scrollMonthLower !== null && this.scrollMonthUpper !== null && this.scrollDisplayGap !== null){
      let lower = this.timeSeries.findIndex((x) => x === this.scrollMonthLower)
      let upper = this.timeSeries.findIndex((x) => x === this.scrollMonthUpper)
      let diff = upper - lower

      this.lowerMonth = Math.floor(lower + diff * this.scrollFraction)
      this.upperMonth = Math.floor(this.lowerMonth + this.scrollDisplayGap - 1)
      this.monthFirst = this.timeSeries[Math.floor(this.lowerMonth)];
      this.monthLast = this.timeSeries[Math.floor(this.upperMonth)];
    }
    else{
      this.monthFirst = this.timeSeries[0];
      this.monthLast = this.timeSeries.at(-1)!;
    }
    this.updateClock()
  }

  override ngOnInit() {
    super.ngOnInit()
  }

  ngAfterViewInit(){

    let ret = this.apiService.getClock();

    this.height = this.clockContainer.nativeElement.offsetWidth / 4 * 3;
    this.height = Math.min(this.height, window.innerHeight - (7 * 25 + 20) - window.innerHeight / 5);
    this.width = this.height;

    this.createSvg()  

    ret.subscribe(data => {
      this.clock = {
        ArbetadeTimmar: data["Arbetade timmar"], 
        Detaljhandel: data["Detaljhandel sällanköpsvaror"], 
        IndustrinsOrderingång: data["Industrins orderingång"], 
        Sysselsättning: data["Sysselsättning"], 
        BNPKvartal: data["BNP kvartal"], 
        BNPMånad: data["BNP-indikator månad"], 
        HushållensKonfindens: data["Hushållens konfidensindikator"], 
        HushållensKonsumtion: data["Hushållens konsumtion"], 
        Lastbilar: data["Nyregistrerade lastbilar"], 
        Personbilar: data["Nyregistrerade personbilar"], 
        NäringslivetsEfterfrågan: data["Näringslivets efterfrågan"], 
        NäringslivetsProduktion: data["Näringslivets produktion"], 
        Varuexport: data["Varuexport"], 
        Varuimport: data["Varuimport"],
      };

      this.upperMonth = this.clock.Sysselsättning.length;
      this.timeSeries = data["time_series"]

      this.updateScale()
      this.drawClock()

      this.ngOnChanges()
    })


  }

  updateSlider(){
    d3.select(`#${this.graphName}-slider`).attr("max", this.clock.Sysselsättning.length)
  }

  updateClockSlider(e: Event){
    let index = (e.target as any).value;
    this.lowerMonth = +index;
    this.updateClock()
  }
  updateClockSliderUpper(e: Event){
    let index = (e.target as any).value;
    this.upperMonth = +index;
    this.updateClock()
  }
  scrollClock(){
    this.updateClock()
    this.lowerMonth++
    this.upperMonth++
  }

  updateScale() {

    let maxY = -999
    let maxX = -999
    let key: keyof clockModel
    for (key in this.clock) {
      for (let i = 0; i < this.clock[key].length; i++) {
        let tempAT = Math.abs(this.clock[key][i][1])
        let tempDAT = Math.abs(this.clock[key][i][2])
        
        if (tempAT !== -999 && tempAT !== 999) {
          if (tempAT > maxY) {
            maxY = tempAT
          }
        }
        if(tempDAT !== -999 && tempDAT!== 999) {
          if (tempDAT > maxX) {
            maxX = tempDAT
          }
        }
      }
    }
    //maxX *= Math.sqrt(2)
    //maxY *= Math.sqrt(2)
    maxX += 0.1
    maxY += 0.1
    if (maxX !== -999 ) {
      this.x.domain([maxX, -maxX])
    }
    if (maxY !== -999) {
          this.y.domain([-maxY, maxY])
    }

    this.x.range([0, this.width])
    this.y.range([this.height, 0])

  }


  updateClock() {
    if(this.GPaths.size > 0){
      let key: keyof clockModel
      this.opacity.domain([this.lowerMonth, this.upperMonth])
      for (key in this.clock) {
        let dots = this.GPaths.get(key) as any
        if(this.displayIndexes.get(key)){
          dots._groups[0].forEach((d:SVGPathElement) => {
            let i: number = +d.dataset["index"]!
            d.style.visibility = (i >= this.lowerMonth && i <= this.upperMonth) ? "" : "hidden"
            d.style.opacity = this.opacity(i) as unknown as string
          })
        }
      }
    }
  }

  drawClock(){
    this.opacity.domain([this.lowerMonth, this.upperMonth])
    let key: keyof clockModel
    for (key in this.clock) {
      let symbol = d3.symbol().type(d3.symbolsFill[this.shapes[key]]).size(100)
      let dots = this.svgData.append("g")
        .attr("class", key)
      this.GPaths.set(key, dots.selectAll("dot")
        .data(this.clock[key].filter(x => x[1] != -999))
        .enter()
        .append("path")
          .attr("class", (d:any) => {return key + " " + this.timeSeries[d[0]]})
          .attr("d", symbol())
          .attr("transform", (d: any) => "translate(" + this.x(d[2]) + "," + (d[1] == -999 ? 0 : this.y(d[1])) + ")")
          .style("opacity", (d:any) => {return (d[1] == -999 ? 0 : this.opacity(d[0]))})
          .style("fill", this.colors[key])
          .style("stroke", "#000000")
          .attr("data-legend",(d: any) => {return key + (d[1] == -999 ? " nodata" : "")})
          .attr("data-index",(d: any) => {return d[0]})
          .attr("data-value",(d: any) => {return d})
          
      )
    }
  }

  private createSvg(): void {
    
    this.svg = d3.select(`figure#${this.graphName}`)
      .append("svg")
      .attr("class", "clockSVG")
      .attr("width", this.width)
      .attr("height", this.height)
    
    let arcGeneratorUpperRight = d3.arc()
      .outerRadius(Math.max(this.width, this.height)/2)
      .innerRadius(0)
      .startAngle(0)
      .endAngle(Math.PI / 2); 
    let arcGeneratorLowerRight = d3.arc()
      .outerRadius(Math.max(this.width, this.height)/2)
      .innerRadius(0)
      .startAngle(Math.PI / 2)
      .endAngle(Math.PI); 
    let arcGeneratorLowerLeft = d3.arc()
      .outerRadius(Math.max(this.width, this.height)/2)
      .innerRadius(0)
      .startAngle(Math.PI)
      .endAngle(3 * Math.PI / 2); 
    let arcGeneratorUpperLeft = d3.arc()
      .outerRadius(Math.max(this.width, this.height)/2)
      .innerRadius(0)
      .startAngle(0)
      .endAngle(-Math.PI / 2); 


    this.svg
      .append("path")
      .attr("transform", "translate(" + (this.width)/2 + "," + (this.height)/2 + ")")
      .attr("d", arcGeneratorLowerRight)
      .style("fill", "#FF5733")
    this.svg
      .append("path")
      .attr("transform", "translate(" + (this.width)/2 + "," + (this.height)/2 + ")")
      .attr("d", arcGeneratorLowerLeft)
      .style("fill", "#FFF033")
    this.svg
      .append("path")
      .attr("transform", "translate(" + (this.width)/2 + "," + (this.height)/2 + ")")
      .attr("d", arcGeneratorUpperLeft)
      .style("fill", "#6CFF1D")
    this.svg
      .append("path")
      .attr("transform", "translate(" + (this.width)/2 + "," + (this.height)/2 + ")")
      .attr("d", arcGeneratorUpperRight)
      .style("fill", "#1DFF3C")

    

    let keys = Object.keys(this.clock);

    let keysColors = new Map<string, string>();
    keys.forEach((key) => {
      keysColors.set(key, this.colors[key as keyof typeof this.colors])
      
    })
    let keysShapes = new Map<string, number>();
    keys.forEach((key) => {
      keysShapes.set(key, this.shapes[key as keyof typeof this.shapes])
      
    })

    let legend = d3.select(`#${this.graphName}-legend`)
      .append("svg")
        .attr("width", this.width)
        .attr("height", 7 * 25 + 20)

    legend.selectAll("mydots")
      .data(keys)
      .enter()
      .append("path")
        .attr("d", (d:string) => { return d3.symbol().type(d3.symbolsFill[keysShapes.get(d)!]).size(100)()})
        .attr("transform", (d: any, i:number) => "translate(" + (10 + 300 * (i % 2)) + "," + (20 + (Math.floor(i / 2))*25) + ")")
        .style("stroke", "#000000")
        .attr("data-legend",(d: any) => {return d})
        .attr("data-index",(d: any, i: number) => {return i})
        .style("fill", (d:string) => { return keysColors.get(d)! })
    
    legend.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
        .attr("class", (d:any) =>{return "legend-"+d})
        .on("click", (e: Event, d:string) => {this.changeVisibilityDots(e, d)})
        .attr("x", (d:any,i:number) => { return (24 + 300 * (i % 2))})
        .attr("y", (d:any,i:number) => { return 20 + Math.floor(i / 2)*25})
        .style("fill", (d:string) => { return keysColors.get(d)! })
        .text((d:any) => { return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

      
    this.svgData = this.svg.append('g');
      
  }

  changeVisibilityDots(e: Event, key: string) {
    let graph = d3.select("#"+this.graphName);
    let legend = d3.select("#"+this.graphName+"-legend");

    let dots = graph.selectAll("g." + key)


    if(legend.select(".legend-"+key+".deselected").empty()) {
      dots.attr("class", key + " deselected")
      legend.selectAll(".legend-"+key).attr("class", "legend-" + key + " deselected")
    }
    else{
      console.log(".legend-"+key)
      console.log(legend.selectAll(".legend-"+key))
      dots.attr("class", key)
      legend.selectAll(".legend-"+key).attr("class", "legend-" + key)
    }
  }

  legendMenuButton(e: Event){
    let elem = document.getElementById(`${this.graphName}-legend`)!;
    if(elem.classList.contains("doNotShow")) {
      elem.classList.remove("doNotShow");
    }
    else{
      elem.classList.add("doNotShow");
    }

  }
}
