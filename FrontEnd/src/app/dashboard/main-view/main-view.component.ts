import { Component, OnInit } from '@angular/core';
import { client, clientrequest } from 'src/app/classes/client';
import { ClientsServiceService } from 'src/app/Services/clients-service.service';
import { MarkerService } from '../../Services/marker-service.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {
  Clinets : client[];
  Positions:clientrequest[];
  Lat:any;
  Lang:any;
  total:String;
  constructor(private ms: MarkerService,private cs:ClientsServiceService) {
   }

  ngOnInit(): void {
    this.getClientsWithGPS();
  }
  getClientsWithGPS(){
    forkJoin({
        clients: this.cs.GettingData(),
        gpsData: this.ms.getGPSData() // Assuming this.ms is your service instance
    }).pipe(
        map(({clients, gpsData}) => {
            // Map through clients and enrich with GPS data
            return clients.map(client => {
                const matchingGPS = gpsData.find(gps => gps.ID === client.ID);
                console.log(`Matching GPS for client ID ${client.ID}:`, matchingGPS); // Debugging lin
                return {
                    ...client,
                    LAT: matchingGPS?.LAT,
                    LNG: matchingGPS?.LNG
                };
            });
        })
    ).subscribe(enrichedClients => {
        this.Clinets = enrichedClients;
    });
}
}
