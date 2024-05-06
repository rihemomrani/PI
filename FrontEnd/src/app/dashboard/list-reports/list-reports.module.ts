import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListReportsRoutingModule } from './list-reports-routing.module';
import { ListReportPageComponent } from './list-report-page/list-report-page.component';


@NgModule({
  declarations: [
    ListReportPageComponent
  ],
  imports: [
    CommonModule,
    ListReportsRoutingModule
  ]
})
export class ListReportsModule { }
