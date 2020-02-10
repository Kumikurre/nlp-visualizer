import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AudioapiService {

  constructor(private http: HttpClient) { }

  apiUrl = 'http://';
  
  postData(data){
    return this.http.post<any>(this.apiUrl, data)
  }
}
