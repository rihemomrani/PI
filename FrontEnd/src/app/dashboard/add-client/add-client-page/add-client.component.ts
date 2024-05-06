import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/Services/client.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {
  clientForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private clientService :ClientService,private router: Router) {
    this.clientForm = this.formBuilder.group({
      ID: ['', Validators.required],
      Name: ['', Validators.required],
      Day: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }


  onSubmit(): void {
    if (this.clientForm.valid) {
      this.clientService.addClient(this.clientForm.value).subscribe({
        next: (res) => {
          console.log('Client added:', res);
          this.router.navigate(['dashboard']);  // Navigate or display a success message
        },
        error: (error) => console.error('Error adding client:', error)
      });
    }
  }
}
