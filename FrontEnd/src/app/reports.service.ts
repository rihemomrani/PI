import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:5001/api/reports'; // URL to web API
  private clientsUrl = 'http://localhost:5001/api/get';

  constructor(private http: HttpClient) { }
  getReports(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  
  getClients() {
    return this.http.get<any[]>(this.clientsUrl);
  }
}
