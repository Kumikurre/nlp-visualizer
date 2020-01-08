import { Injectable } from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor() { }
// TODO this is an example from 
// https://rxjs-dev.firebaseapp.com/api/webSocket/webSocket
// It should provide a websocket interface


  // const subject: WebSocketSubject<T> = webSocket("ws://localhost:8081");
  // subject.subscribe(
  //   msg => console.log('message received: ' + msg), // Called whenever there is a message from the server.
  //   err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
  //   () => console.log('complete') // Called when connection is closed (for whatever reason).
  // );
}
