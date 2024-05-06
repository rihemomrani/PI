import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Edit_clientRouting } from './Edit-client-routing.module';
import { EditClientComponent } from './edit-client/edit-client.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EditClientComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Edit_clientRouting
  ]
})
export class Edit_clientModel { }
