import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISpecifikacije } from '../specifikacije.model';
import { SpecifikacijeService } from '../service/specifikacije.service';

@Injectable({ providedIn: 'root' })
export class SpecifikacijeRoutingResolveService implements Resolve<ISpecifikacije | null> {
  constructor(protected service: SpecifikacijeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISpecifikacije | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((specifikacije: HttpResponse<ISpecifikacije>) => {
          if (specifikacije.body) {
            return of(specifikacije.body);
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
