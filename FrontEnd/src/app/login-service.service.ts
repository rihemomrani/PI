import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private httpclient : HttpClient) {
   }
   private options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
   logging_in(User){
    return this.httpclient.post("http://127.0.0.1:5001/api/login",User,this.options)
  }
  SigningUp(User){
    return this.httpclient.post("http://127.0.0.1:5001/api/signup",User,this.options)
  }
}
