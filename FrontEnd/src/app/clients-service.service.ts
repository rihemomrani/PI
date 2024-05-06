import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsServiceService {

  constructor(private httpclient : HttpClient) { }
  private options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  GettingData(): Observable<any[]>{
    return this.httpclient.get<any[]>("http://127.0.0.1:5001/api/get")
  }
}
