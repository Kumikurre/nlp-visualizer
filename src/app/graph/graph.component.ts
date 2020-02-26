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
        {"name": 0, "value":4},
        {"name": 1, "value":15},
      ]
    },
    {
      "name": "avg_abstraction_level",
      "series": [
        {"name": 0, "value":6},
        {"name": 1, "value":4},
      ]
    },
    {
      "name": "avg_polysemy",
      "series": [
        {"name": 0, "value":2},
        {"name": 1, "value":6},
      ]
    },
    {
      "name": "avg_ic_blanchard",
      "series": [
        {"name": 0, "value":11},
        {"name": 1, "value":4},
      ]
    },
  ]

  // Constants that help websocket to establish communication
  subject;
  newvalue;

  constructor(private webSocket: WebsocketService,private cd: ChangeDetectorRef) {
   }

   ngOnInit() {
    this.subject = this.webSocket.connect('ws://172.17.0.1:8765/client');
    this.subject.subscribe((data) => {
      this.cd.detach()
      // Fix parsing issue with single quotes
      let parsed_data = data["data"].replace(/'/g, '"')
      // Parse string to object
      let incoming_data = JSON.parse(parsed_data)
      // Make a reasonable timestamp
      let timestamp = Math.floor(data.timeStamp/1000)
      // Loop over the keys in incoming data
      for (var semvar in incoming_data) {
        // Construct a new datapoint to be added to the internal data structure
        let datapoint:{"name": number,"value":number}
        datapoint["name"] = timestamp
        datapoint["value"] = incoming_data[semvar]

          // Loop over the data structure to find the correct object
        for (var dataset in this.socketdata){
          if (semvar == this.socketdata[dataset]["name"]){
            // Push the data to the array
            this.socketdata[dataset]["series"].push(datapoint)
          }
        }

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

