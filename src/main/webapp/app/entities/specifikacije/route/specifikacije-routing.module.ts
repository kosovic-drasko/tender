import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SpecifikacijeComponent } from '../list/specifikacije.component';
import { SpecifikacijeUpdateComponent } from '../update/specifikacije-update.component';

const specifikacijeRoute: Routes = [
  {
    path: '',
    component: SpecifikacijeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'unos',
    component: SpecifikacijeComponent,
    data: {
      oznaka: 'unosi',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SpecifikacijeUpdateComponent,

    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SpecifikacijeUpdateComponent,

    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(specifikacijeRoute)],
  exports: [RouterModule],
})
export class SpecifikacijeRoutingModule {}
