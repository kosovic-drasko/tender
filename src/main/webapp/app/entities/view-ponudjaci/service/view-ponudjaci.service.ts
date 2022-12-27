import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IViewPonudjaci, NewViewPonudjaci } from '../view-ponudjaci.model';

export type PartialUpdateViewPonudjaci = Partial<IViewPonudjaci> & Pick<IViewPonudjaci, 'id'>;

export type EntityResponseType = HttpResponse<IViewPonudjaci>;
export type EntityArrayResponseType = HttpResponse<IViewPonudjaci[]>;

@Injectable({ providedIn: 'root' })
export class ViewPonudjaciService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/view-ponudjacis');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IViewPonudjaci>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IViewPonudjaci[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  getViewPonudjaciIdentifier(viewPonudjaci: Pick<IViewPonudjaci, 'id'>): number {
    return viewPonudjaci.id;
  }

  compareViewPonudjaci(o1: Pick<IViewPonudjaci, 'id'> | null, o2: Pick<IViewPonudjaci, 'id'> | null): boolean {
    return o1 && o2 ? this.getViewPonudjaciIdentifier(o1) === this.getViewPonudjaciIdentifier(o2) : o1 === o2;
  }

  addViewPonudjaciToCollectionIfMissing<Type extends Pick<IViewPonudjaci, 'id'>>(
    viewPonudjaciCollection: Type[],
    ...viewPonudjacisToCheck: (Type | null | undefined)[]
  ): Type[] {
    const viewPonudjacis: Type[] = viewPonudjacisToCheck.filter(isPresent);
    if (viewPonudjacis.length > 0) {
      const viewPonudjaciCollectionIdentifiers = viewPonudjaciCollection.map(
        viewPonudjaciItem => this.getViewPonudjaciIdentifier(viewPonudjaciItem)!
      );
      const viewPonudjacisToAdd = viewPonudjacis.filter(viewPonudjaciItem => {
        const viewPonudjaciIdentifier = this.getViewPonudjaciIdentifier(viewPonudjaciItem);
        if (viewPonudjaciCollectionIdentifiers.includes(viewPonudjaciIdentifier)) {
          return false;
        }
        viewPonudjaciCollectionIdentifiers.push(viewPonudjaciIdentifier);
        return true;
      });
      return [...viewPonudjacisToAdd, ...viewPonudjaciCollection];
    }
    return viewPonudjaciCollection;
  }
}
