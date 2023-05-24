import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { ClockComponent } from './clock/clock.component';
import { HttpClientModule } from '@angular/common/http';
import { HighchartsChartModule } from 'highcharts-angular';
import { ClockScrollComponent } from './scrollContainer/scrollContainer.component';
import { BaseScrollComponent } from './base-scroll/base-scroll.component';
import { IntroTextComponent } from './intro-text/intro-text.component';
import { BaseTextComponent } from './base-text/base-text.component';
import { FirstTextComponent } from './first-text/first-text.component';
import { KonjComponent } from './konj/konj.component';
import { BaseGraphComponent } from './base-graph/base-graph.component';
import { ScrollArrowComponent } from './scroll-arrow/scroll-arrow.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ClockComponent,
    ClockScrollComponent,
    BaseScrollComponent,
    IntroTextComponent,
    BaseTextComponent,
    FirstTextComponent,
    KonjComponent,
    BaseGraphComponent,
    ScrollArrowComponent,
  ],
  imports: [
    HighchartsChartModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
