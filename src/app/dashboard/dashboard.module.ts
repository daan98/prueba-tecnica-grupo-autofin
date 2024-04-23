import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboradLayoutComponent } from './pages/dashborad-layout/dashborad-layout.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';


@NgModule({
  declarations: [],
  imports: [
    DashboardRoutingModule,
    PrimeNgModule,
  ]
})
export class DashboardModule { }
