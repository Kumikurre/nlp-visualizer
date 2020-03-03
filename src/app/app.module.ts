import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { WebsocketService } from './websocket.service';
import { AudioapiService } from './audioapi.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphComponent } from './graph/graph.component';
import { RecorderComponent } from './recorder/recorder.component';
import { ThumbComponent } from './thumb/thumb.component'



@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    RecorderComponent,
    ThumbComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [WebsocketService, AudioapiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
