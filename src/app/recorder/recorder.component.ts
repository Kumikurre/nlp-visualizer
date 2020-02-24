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
    console.log('starting recording, and sending data. listening to : ', 'ws://172.17.0.1:8765/client')
    navigator.permissions.query({name: 'microphone'})
    .then((permissionObj) => {
     console.log('Audio accesss permission: ', permissionObj.state);
    })
    var recLength = 0;
    var bufferSize = 2048
    var recBuffer = []
    var payloadBufferLength = 0;

    var API = this.audioApi

    const handleSuccess = function(stream) {
      
      const context = new AudioContext({sampleRate: 44100});
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(bufferSize, 1, 1);
  
      source.connect(processor);
      processor.connect(context.destination);
      processor.onaudioprocess = function(e) {
        recLength = recLength + e.outputBuffer.duration
        if( recLength < 8 ){
          recBuffer.push(new Float32Array(e.inputBuffer.getChannelData(0)));
          payloadBufferLength += bufferSize
        }
        else{
          recBuffer.push(new Float32Array(e.inputBuffer.getChannelData(0)));
          payloadBufferLength += bufferSize
          API.postData(recBuffer, payloadBufferLength)
          recLength = 0;
          payloadBufferLength = 0;
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
