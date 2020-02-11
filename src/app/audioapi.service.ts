import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AudioapiService {

  constructor(private httpClient: HttpClient) { }

  apiUrl = 'http://localhost:8080/api';
  data = {};
  numChannels = 1;
  sampleRate = 44100;

  floatTo16BitPCM(output, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  }
  
  writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  encodeWAV(samples) {
      let buffer = new ArrayBuffer(44 + samples.length * 2);
      let view = new DataView(buffer);

      /* RIFF identifier */
      this.writeString(view, 0, 'RIFF');
      /* RIFF chunk length */
      view.setUint32(4, 36 + samples.length * 2, true);
      /* RIFF type */
      this.writeString(view, 8, 'WAVE');
      /* format chunk identifier */
      this.writeString(view, 12, 'fmt ');
      /* format chunk length */
      view.setUint32(16, 16, true);
      /* sample format (raw) */
      view.setUint16(20, 1, true);
      /* channel count */
      view.setUint16(22, this.numChannels, true);
      /* sample rate */
      view.setUint32(24, this.sampleRate, true);
      /* byte rate (sample rate * block align) */
      view.setUint32(28, this.sampleRate * 4, true);
      /* block align (channel count * bytes per sample) */
      view.setUint16(32, this.numChannels * 2, true);
      /* bits per sample */
      view.setUint16(34, 16, true);
      /* data chunk identifier */
      this.writeString(view, 36, 'data');
      /* data chunk length */
      view.setUint32(40, samples.length * 2, true);

      this.floatTo16BitPCM(view, 44, samples);

      return view;
  }

  postData(audiobuffer){
    var data = this.data
    console.log(audiobuffer)
    
    data['audio'] = this.encodeWAV(audiobuffer)
    console.log(data)
    console.log('sending data: ', data)
    return this.httpClient.post(this.apiUrl, data).subscribe(data => {
      console.log('response from api: ', data)
  })
  }
}
