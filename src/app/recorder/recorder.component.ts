import { Component, OnInit } from '@angular/core';
import { AudioapiService } from '../audioapi.service';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.css']
})
export class RecorderComponent implements OnInit {

  constructor(public audioApi: AudioapiService) {}

  ngOnInit() {
  }

  start_recording(){
    console.log('starting recording, and sending data to URL:', 'demourl')
    navigator.permissions.query({name: 'microphone'})
    .then((permissionObj) => {
     console.log('Audio accesss permission: ', permissionObj.state);
    })
    var recLength = 0
    var recBuffer = []
    var post_resp;

    var API = this.audioApi

    const handleSuccess = function(stream) {
      
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(4096, 1, 1);
  
      source.connect(processor);
      processor.connect(context.destination);
      processor.onaudioprocess = function(e) {
        recLength = recLength + e.outputBuffer.duration
        if( recLength < 8 ){
          recBuffer.push(e.inputBuffer.getChannelData(0));
        }
        else{
          recBuffer.push(e.inputBuffer.getChannelData(0));
          recLength = 0;
          API.postData(recBuffer)
          recBuffer = [];
        }
      }
    }

    try {
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(handleSuccess);
    } catch(err) {
      console.log(err)
    }

  }
}
