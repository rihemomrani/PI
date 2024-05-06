import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { predectionroutingmodule } from './predection-routing.module';
import { PredictionComponent } from './prediction/prediction.component';

@NgModule({
  declarations: [
    PredictionComponent
  ],
  imports: [
    CommonModule,
    predectionroutingmodule
  ]
})
export class  predectionmodule{ }
