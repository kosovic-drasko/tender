import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ViewPonudjaciComponent } from './list/view-ponudjaci.component';
import { ViewPonudjaciDetailComponent } from './detail/view-ponudjaci-detail.component';
import { ViewPonudjaciRoutingModule } from './route/view-ponudjaci-routing.module';

@NgModule({
  imports: [SharedModule, ViewPonudjaciRoutingModule],
  declarations: [ViewPonudjaciComponent, ViewPonudjaciDetailComponent],
})
export class ViewPonudjaciModule {}
