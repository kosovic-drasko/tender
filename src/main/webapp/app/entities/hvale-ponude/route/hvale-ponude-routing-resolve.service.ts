import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHvalePonude } from '../hvale-ponude.model';
import { HvalePonudeService } from '../service/hvale-ponude.service';

@Injectable({ providedIn: 'root' })
export class HvalePonudeRoutingResolveService implements Resolve<IHvalePonude | null> {
  constructor(protected service: HvalePonudeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHvalePonude | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((hvalePonude: HttpResponse<IHvalePonude>) => {
          if (hvalePonude.body) {
            return of(hvalePonude.body);
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
