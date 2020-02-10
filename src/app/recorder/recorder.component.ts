import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.css']
})
export class RecorderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  start_recording(){
    console.log('starting recording, and sending data to URL:', 'demourl')
    navigator.permissions.query({name: 'microphone'})
    .then((permissionObj) => {
     console.log('Audio accesss permission: ', permissionObj.state);
    })
    var recLength = 0,
        recBuffersL = [],
        recBuffersR = [];

    const handleSuccess = function(stream) {
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(4096, 2, 2);
  
      source.connect(processor);
      processor.connect(context.destination);
  
      processor.onaudioprocess = function(e) {
        console.log('recLength: ', recLength)
        recLength = recLength + e.outputBuffer.duration
        if( recLength < 8 ){
          recBuffersL.push(e.inputBuffer.getChannelData(0));
          recBuffersR.push(e.inputBuffer.getChannelData(1));
          // recLength += e.inputBuffer.getChannelData(0).length;
        }
        else{
          recBuffersL.push(e.inputBuffer.getChannelData(0));
          recBuffersR.push(e.inputBuffer.getChannelData(1));
          console.log(recBuffersL, recBuffersR)
          recLength = 0;
          // Should somehow reset the playbacktime here...
          recBuffersL = [];
          recBuffersR = [];
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
