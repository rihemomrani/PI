import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports-page/reports.component';

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    ListReportsRoutingModule
  ]
})
export class ListReportsModule { }
