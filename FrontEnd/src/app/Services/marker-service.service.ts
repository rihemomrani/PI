import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { LatLngExpression } from "leaflet";
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  coords: any;
  coordsChange: Subject<LatLngExpression> = new Subject<LatLngExpression>();

  constructor(private httpclient : HttpClient){
    this.coords = [];
  }

  change(coords: Array<number>) {
    this.coords = coords;
    this.coordsChange.next(this.coords);
  }
  RestoreCords():Observable<any[]>{
    return this.httpclient.get<any[]>("http://127.0.0.1:5000/api/getRTDB")
  }
  getGPSData(): Observable<any[]> {
    return this.httpclient.get<any[]>("http://127.0.0.1:5000/api/getRTDB")
}
  RestoreCords2():Observable<object>{
    return this.httpclient.get("http://127.0.0.1:5000/api/getRTDB2")
  }
  getFall(){
    return this.httpclient.get("http://127.0.0.1:5000/api/GetFall")
  }
}
