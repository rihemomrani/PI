import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Ensure Router is imported
import { LoginServiceService } from 'src/app/Services/login-service.service';

@Component({
  selector: 'app-router-outlet',
  templateUrl: './router-outlet.component.html',
  styleUrls: ['./router-outlet.component.scss']
})
export class RouterOutletComponent implements OnInit {
  isAdmin: boolean = false;

  constructor(
    private loginService: LoginServiceService,
    private router: Router  // Inject Router here correctly
  ) { }

  ngOnInit(): void {
    this.checkIfAdmin();
  }

  checkIfAdmin(): void {
    this.isAdmin = this.loginService.isAdmin();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/auth']); // Now 'router' is defined and should work
  }
}
