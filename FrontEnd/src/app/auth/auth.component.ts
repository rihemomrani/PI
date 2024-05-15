// AuthComponent
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginServiceService } from '../Services/login-service.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  formLogin: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private loginService: LoginServiceService
  ) {
    this.formLogin = this.formBuilder.group({
      email: "",
      password: ""
    });
  }

  ngOnInit(): void {}
  SignUp(){
    this.router.navigate(['sign-up']);
  }

  login() {
    this.loginService.logging_in(this.formLogin.value).subscribe({
      next: (data) => {
        console.log(data);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error) => {
        alert("Password or Email is wrong!");
        console.error(error);
      }
    });
  }
}
