import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/app/Services/client.service';
@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent implements OnInit {
  editForm: FormGroup;
  clientId: number;

  constructor(private router: Router,private route: ActivatedRoute, private formBuilder: FormBuilder, private clientService: ClientService) { }
 
  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      status: ['', Validators.required],
      falling: ['', Validators.required],
      // Add more form controls as needed
    });
    this.route.params.subscribe(params => {
      this.clientId = params['id'];
      this.getClientDetails(this.clientId);
    });
  }
  getClientDetails(clientId: number): void {
    this.clientService.getClient(clientId).subscribe({
      next: (client) => {
        this.editForm.patchValue({
          name: client.Name,
          status: client.Status,
          falling: client.falling,
          // Patch more form values as needed
        });
      },
      error: (error) => {
        console.error('Error fetching client details:', error);
        // Handle error
      }
    });
  }
  onSubmit(): void {
    if (this.editForm.valid) {
      // Prepare the data to send
      const formData = {
        Name: this.editForm.value.name,
        Status: this.editForm.value.status,
        falling: this.editForm.value.falling
      };
      this.clientService.updateClient(this.clientId, formData).subscribe({
        next: () => {
          alert('Client updated successfully');
          this.router.navigate(['dashboard']);
        },
        error: (error) => {
          console.error('Error updating client:', error);
        }
      });
    }
  }
}
