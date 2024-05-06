import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainViewComponent } from './main-view/main-view.component';
import { RouterOutletComponent } from './router-outlet/router-outlet.component';
const routes: Routes = [
  { path: '', component: RouterOutletComponent,
  children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
      path: 'home', component: MainViewComponent
    },
    {
      path: 'reports', loadChildren: () => import("./list-reports/list-reports.module").then(m => m.ListReportsModule)
    },
    {
      path: 'map', loadChildren: () => import("./map/map.module").then(m => m.MapModule)
    },
    {
      path: 'reports-page', loadChildren: () => import("./reports/reports.module").then(m => m.ListReportsModule)
    },
    {
      path: 'AddClientpage', loadChildren: () => import("./add-client/add-client.module").then(m => m.AddClientModule)
    },
    {
      path: 'prediction', loadChildren: () => import("./Predection/predection.module").then(m => m.predectionmodule)
    },
    {
      path: 'EditClientPage/:id',
      loadChildren: () => import("./Edit_client/Edit-client.module").then(m => m.Edit_clientModel)
    },
  ]
},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
