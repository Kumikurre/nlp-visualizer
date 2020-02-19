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
  xAxisLabel: string = 'Time';
  yAxisLabel: string = 'Value';
  timeline: boolean = false;
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  // Data structure for graph
  socketdata = [
    {
      "name": "avg_resnik_similarity",
      "series": [
      ]
    },
    {
      "name": "avg_abstraction_level",
      "series": [
      ]
    },
    {
      "name": "avg_polysemy",
      "series": [
      ]
    },
    {
      "name": "avg_ic_blanchard",
      "series": [
      ]
    },
  ]
  
  // Constants that help websocket to establish communication
  subject;
  newvalue;

  constructor(private webSocket: WebsocketService,private cd: ChangeDetectorRef) {
   }
   data: "{'avg_polysemy': 0.461, 'avg_abstraction_level': 'avg_ic_blanchard': 0.646, 'avg_resnik_similarity': 0.059}"

   ngOnInit() {
    this.subject = this.webSocket.connect('ws://172.17.0.1:8765/client');
    this.subject.subscribe((data) => {
      console.log('Rawdata from the socket: ', data)
      this.cd.detach()
      let incoming_data = JSON.parse(data.data)
      let timestamp = Math.floor(data.timeStamp/1000)
      for (var semvar in incoming_data) {
        let datapoint = {}
        datapoint["name"] = timestamp
        datapoint["value"] = incoming_data[semvar]
        this.socketdata.find(o => o.name == semvar)["series"].push(datapoint)

      }
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

