import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getAllPredictionData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllPredictionData`);
  }  

  getPrediction(features: number[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ features });
    return this.http.post(`${this.apiUrl}/predict-fall`, body, { headers });
  }
}