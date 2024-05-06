import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../Services/reports.service';
import { LoginServiceService } from '../../../Services/login-service.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  reports: any[] = [];
  isAdmin: boolean = false;

  constructor(
    private reportsService: ReportsService,
    private loginService: LoginServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkIfAdmin();
    forkJoin({
      reports: this.reportsService.getReports(),
      clients: this.reportsService.getClients()
    }).pipe(
      map(({ reports, clients }) => {
        return reports.map(report => {
          const client = clients.find(c => c.ID === report.ID);
          return {
            ...report,
            Name: client?.Name || 'Unknown'
          };
        });
      })
    ).subscribe(combinedData => {
      this.reports = combinedData;
    }, error => {
      console.error('Failed to get data:', error);
    });
  }

  checkIfAdmin(): void {
    this.isAdmin = this.loginService.isAdmin();  // Assuming this method is implemented in the LoginService
  }

  addClient(): void {
    this.router.navigate(['/add-client']);  // Route to the add-client component
  }
}