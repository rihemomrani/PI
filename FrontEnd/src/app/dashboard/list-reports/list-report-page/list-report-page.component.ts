import { Component, OnInit } from '@angular/core';
import { clientrequest, Rapportvalues, client } from 'src/app/classes/client';
import { Router } from '@angular/router';
import { Report } from 'src/app/classes/report';
import { ClientsServiceService } from 'src/app/Services/clients-service.service';
import { MarkerService } from '../../../Services/marker-service.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClientService } from 'src/app/Services/client.service';
import { LoginServiceService } from 'src/app/Services/login-service.service';
@Component({
  selector: 'app-list-report-page',
  templateUrl: './list-report-page.component.html',
  styleUrls: ['./list-report-page.component.scss']
})
export class ListReportPageComponent implements OnInit {
  isAdmin: boolean = false;
  Lat:any;
  Lang:any;
  total:String;
  triggred:boolean=true;
  reportsMenu : Report[] 
  Positions:Rapportvalues[];
  Clinets : client[];
  constructor(private loginService: LoginServiceService,private ms: MarkerService,private cs:ClientsServiceService , private css:ClientService,private router :Router) { }

  ngOnInit(): void {
    this.getClientsWithGPS();
    this.checkIfAdmin();
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
deleteClient(clientId: number): void {
  console.log(clientId);
  if (confirm('Are you sure you want to delete this client?')) {
    this.css.deleteClient(clientId).subscribe({
      next: () => {
        this.getClientsWithGPS();
        alert('Client deleted successfully');
      },
      error: (error) => alert('Error deleting client: ' + error.error.message)
    });
  }
}
editClient(Client):void{
  this.router.navigate(['./EditClientPage']);
}
checkIfAdmin(): void {
  this.isAdmin = this.loginService.isAdmin();  // This will now work as loginService is properly injected
}
}
