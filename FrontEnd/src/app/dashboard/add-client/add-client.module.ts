import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddClientRouting } from './add-client-routing.module';
import { AddClientComponent } from './add-client-page/add-client.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddClientComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddClientRouting
  ]
})
export class AddClientModule { }
