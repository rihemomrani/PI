import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { client } from '../classes/client';


@Injectable({
  providedIn: 'root'
})

export class ClientService {
  private apiUrl = 'http://127.0.0.1:5000/api/clients';  // URL to your API
  client:client;
  constructor(private http: HttpClient) { }
  addClient(clientData: any): Observable<any> {
    clientData.ID = +clientData.ID;  // Convert ID to a number if it's being sent as a string
    console.log('Sending data:', clientData); // Log data being sent
    return this.http.post(this.apiUrl, clientData);
  }
  deleteClient(clientId: number): Observable<any> {
    const url = `${this.apiUrl}/${clientId}`;
    return this.http.delete<number>(url);
  }
  getClient(clientId: number): Observable<client> {
    return this.http.get<client>(`${this.apiUrl}/${clientId}`);
  }
  updateClient(clientId: number, clientData: any): Observable<any> {
    const url = `${this.apiUrl}/${clientId}`;
    return this.http.put<any>(url, clientData).pipe(
      catchError(error => {
        throw 'Error updating client: ' + error;
      })
    );
  }

}
