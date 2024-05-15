import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { MapPageComponent } from './dashboard/map/map-page/map-page.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PredictionComponent } from './dashboard/Predection/prediction/prediction.component';
import { AuthGuard } from './auth.guard'; // Make sure the path is correct

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'map', component: MapPageComponent, canActivate: [AuthGuard] }, // Example of protecting the map page
  { path: 'forget-password', component: ForgetpasswordComponent },
  {
    path: 'auth',
    component: AuthComponent,
  },
  { path: 'prediction', component: PredictionComponent, canActivate: [AuthGuard] }, // Protect the prediction component as this should not be accessable without a valid JWT token...
  {
    path:'sign-up',
    component:SignUpComponent
  },
  {
    path: 'dashboard',
    canActivateChild: [AuthGuard],
    children:[
      {
        path: '',
        loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard] 
})
export class AppRoutingModule { }
