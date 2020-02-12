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
  
  writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
  flattenArray(channelBuffer, recordingLength) {
    var result = new Float32Array(recordingLength);
    var offset = 0;
    for (var i = 0; i < channelBuffer.length; i++) {
        var buffer = channelBuffer[i];
        result.set(buffer, offset);
        offset += buffer.length;
    }
    return result;
  }

  interleave(leftChannel, rightChannel) {
    var length = leftChannel.length + rightChannel.length;
    var result = new Float32Array(length);

    var inputIndex = 0;

    for (var index = 0; index < length;) {
        result[index++] = leftChannel[inputIndex];
        result[index++] = rightChannel[inputIndex];
        inputIndex++;
    }
    return result;
  }
  
  writeUTFBytes(view, offset, string) {
    for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  encodeWAV(samples, recordingLength) {
      let samplesL = this.flattenArray(samples, recordingLength);
      let samplesR = this.flattenArray(samples, recordingLength);

      var interleaved = this.interleave(samplesL, samplesR);

      let buffer = new ArrayBuffer(44 + interleaved.length * 2);
      let view = new DataView(buffer);

      // RIFF chunk descriptor
      this.writeUTFBytes(view, 0, 'RIFF');
      view.setUint32(4, 44 + interleaved.length * 2, true);
      this.writeUTFBytes(view, 8, 'WAVE');
      // FMT sub-chunk
      this.writeUTFBytes(view, 12, 'fmt ');
      view.setUint32(16, 16, true); // chunkSize
      view.setUint16(20, 1, true); // wFormatTag
      view.setUint16(22, 2, true); // wChannels: mono (1 channels)
      view.setUint32(24, this.sampleRate, true); // dwSamplesPerSec
      view.setUint32(28, this.sampleRate * 4, true); // dwAvgBytesPerSec
      view.setUint16(32, 4, true); // wBlockAlign
      view.setUint16(34, 16, true); // wBitsPerSample
      // data sub-chunk
      this.writeUTFBytes(view, 36, 'data');
      view.setUint32(40, interleaved.length * 2, true);

      var index = 44; 
            var volume = 1;
            for (var i = 0; i < interleaved.length; i++) {
                view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
                index += 2;
            }

      return view;
  }

  exportWAV(data, recLength) {
    let dataview = this.encodeWAV(data, recLength);
    let audioBlob = new Blob([dataview], {type: 'audio/wav'});
    return audioBlob

}

  postData(audiobuffer, recLength){
    var data = this.data
    
    data = this.exportWAV(audiobuffer, recLength)
    console.log('sending data: ', data)
    var url = URL.createObjectURL(data);

    var a = document.createElement("a");
    document.body.appendChild(a);
    // a.style = "display: none";
    a.href = url;
    a.download = "sample.wav";
    a.click();
    window.URL.revokeObjectURL(url);
    return this.httpClient.post(this.apiUrl, data).subscribe(data => {
      console.log('response from api: ', data)
  })
  }
}
