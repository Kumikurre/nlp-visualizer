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

    const handleSuccess = function(stream) {
      console.log(stream)
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(1024, 1, 1);
  
      source.connect(processor);
      processor.connect(context.destination);
  
      processor.onaudioprocess = function(e) {
        // Do something with the data, e.g. convert it to WAV
        console.log(e.inputBuffer);
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
