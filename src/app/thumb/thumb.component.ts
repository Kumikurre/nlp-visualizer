import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-thumb',
  templateUrl: './thumb.component.html',
  styleUrls: ['./thumb.component.css']
})
export class ThumbComponent implements OnInit {

  constructor(private webSocket: WebsocketService) { }

  // Constants that help websocket to establish communication
  subject;
  isThumbUp: boolean = true;
  ngOnInit() {
    this.subject = this.webSocket.connect('ws://172.17.0.1:8765/client');
    this.subject.subscribe((data) => {
      // Fix parsing issue with single quotes
      let parsed_data = data["data"].replace(/'/g, '"')
      // Parse string to object
      let incoming_data = JSON.parse(parsed_data)
      if (incoming_data["value"] >= 0.5){
        this.isThumbUp = true;
      }
      else{
        this.isThumbUp = false;
      }
    })
    }

    swapThumb(){
      this.isThumbUp = !this.isThumbUp
    }

    }
