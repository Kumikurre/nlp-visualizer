import { Component, OnInit, NgModule, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {WebsocketService} from '../websocket.service';

// THIS COMPONENT USES NGX-GRAPHS:
// https://github.com/swimlane/ngx-charts

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit {
  
  // CONFIG FOR ngx-graph
  viewsize: any[] = [700, 300];
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = false;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Timestamp';
  yAxisLabel: string = 'Value';
  timeline: boolean = false;
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  // Data structure for graph
  socketdata = [
    {
      "name": "Demodata",
      "series": [
      ]
    },
  ]
  
  // Constants that help websocket to establish communication
  subject;
  newvalue;

  constructor(private webSocket: WebsocketService,private cd: ChangeDetectorRef) {
   }

   ngOnInit() {
    this.subject = this.webSocket.connect('ws://localhost:8765');
    this.subject.subscribe((data) => {
      this.cd.detach()
      this.newvalue = {"name":Math.floor(data.timeStamp/1000), "value":data.data}
      this.socketdata[0].series.push(this.newvalue)
      this.socketdata[0].series = [...this.socketdata[0].series]
      this.socketdata = this.socketdata.slice()
      console.log(this.socketdata)
      this.cd.detectChanges()

    });
  }

  onSelect(val): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(val)));
  }

  onActivate(val): void {
    console.log('Activate', JSON.parse(JSON.stringify(val)));
  }

  onDeactivate(val): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(val)));
  }
}

