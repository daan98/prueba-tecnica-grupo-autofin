import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { DashboradLayoutComponent } from './pages/dashborad-layout/dashborad-layout.component';


@NgModule({
  declarations: [],
  imports: [
    DashboardRoutingModule,
    PrimeNgModule,
  ]
})
export class DashboardModule { }
