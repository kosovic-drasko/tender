import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IViewPonudjaci } from '../view-ponudjaci.model';
import { ViewPonudjaciService } from '../service/view-ponudjaci.service';

@Injectable({ providedIn: 'root' })
export class ViewPonudjaciRoutingResolveService implements Resolve<IViewPonudjaci | null> {
  constructor(protected service: ViewPonudjaciService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IViewPonudjaci | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((viewPonudjaci: HttpResponse<IViewPonudjaci>) => {
          if (viewPonudjaci.body) {
            return of(viewPonudjaci.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
