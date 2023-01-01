import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISpecifikacije, NewSpecifikacije } from '../specifikacije.model';
import { environment } from '@ng-bootstrap/ng-bootstrap/environment';

export type PartialUpdateSpecifikacije = Partial<ISpecifikacije> & Pick<ISpecifikacije, 'id'>;

export type EntityResponseType = HttpResponse<ISpecifikacije>;
export type EntityArrayResponseType = HttpResponse<ISpecifikacije[]>;

@Injectable({ providedIn: 'root' })
export class SpecifikacijeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/specifikacijes');
  public resourceUrlExcelUpload = SERVER_API_URL + '/api/uploadfiles/specifikacije';
  public resourceUrlExcelDownload = SERVER_API_URL + '/api/uploadfiles/specifikacije/file';
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(specifikacije: ISpecifikacije | (Omit<ISpecifikacije, 'id'> & { id: null })): Observable<EntityResponseType> {
    return this.http.post<ISpecifikacije>(this.resourceUrl, specifikacije, { observe: 'response' });
  }

  update(specifikacije: ISpecifikacije): Observable<EntityResponseType> {
    return this.http.put<ISpecifikacije>(`${this.resourceUrl}/${this.getSpecifikacijeIdentifier(specifikacije)}`, specifikacije, {
      observe: 'response',
    });
  }

  partialUpdate(specifikacije: PartialUpdateSpecifikacije): Observable<EntityResponseType> {
    return this.http.patch<ISpecifikacije>(`${this.resourceUrl}/${this.getSpecifikacijeIdentifier(specifikacije)}`, specifikacije, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISpecifikacije>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISpecifikacije[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSpecifikacijeIdentifier(specifikacije: Pick<ISpecifikacije, 'id'>): number {
    return specifikacije.id;
  }

  compareSpecifikacije(o1: Pick<ISpecifikacije, 'id'> | null, o2: Pick<ISpecifikacije, 'id'> | null): boolean {
    return o1 && o2 ? this.getSpecifikacijeIdentifier(o1) === this.getSpecifikacijeIdentifier(o2) : o1 === o2;
  }
  UploadExcel(formData: FormData): any {
    const headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http.post(this.resourceUrlExcelUpload, formData, { headers });
  }

  addSpecifikacijeToCollectionIfMissing<Type extends Pick<ISpecifikacije, 'id'>>(
    specifikacijeCollection: Type[],
    ...specifikacijesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const specifikacijes: Type[] = specifikacijesToCheck.filter(isPresent);
    if (specifikacijes.length > 0) {
      const specifikacijeCollectionIdentifiers = specifikacijeCollection.map(
        specifikacijeItem => this.getSpecifikacijeIdentifier(specifikacijeItem)!
      );
      const specifikacijesToAdd = specifikacijes.filter(specifikacijeItem => {
        const specifikacijeIdentifier = this.getSpecifikacijeIdentifier(specifikacijeItem);
        if (specifikacijeCollectionIdentifiers.includes(specifikacijeIdentifier)) {
          return false;
        }
        specifikacijeCollectionIdentifiers.push(specifikacijeIdentifier);
        return true;
      });
      return [...specifikacijesToAdd, ...specifikacijeCollection];
    }
    return specifikacijeCollection;
  }
  // /api/specifikacije/file/{sifraPostupka}
  //   download(sifraPostupka: string): Observable<Blob> {
  //     return this.http.get(`${this.resourceUrlExcelDownload}/${sifraPostupka}`, {
  //       responseType: 'blob'
  //     });
  //   }
  download(): Observable<Blob> {
    // `${environment.baseUrl}/files/${file}`
    return this.http.get(`${this.resourceUrlExcelDownload}`, {
      responseType: 'blob',
    });
  }
}
