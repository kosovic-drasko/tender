import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ViewPonudjaciComponent } from '../list/view-ponudjaci.component';
import { ViewPonudjaciDetailComponent } from '../detail/view-ponudjaci-detail.component';
import { ViewPonudjaciRoutingResolveService } from './view-ponudjaci-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const viewPonudjaciRoute: Routes = [
  {
    path: '',
    component: ViewPonudjaciComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ViewPonudjaciDetailComponent,
    resolve: {
      viewPonudjaci: ViewPonudjaciRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(viewPonudjaciRoute)],
  exports: [RouterModule],
})
export class ViewPonudjaciRoutingModule {}
