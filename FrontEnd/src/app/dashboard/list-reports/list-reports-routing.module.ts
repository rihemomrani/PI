import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListReportPageComponent } from './list-report-page/list-report-page.component';

const routes: Routes = [
  {
    path: '', component: ListReportPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListReportsRoutingModule { }
