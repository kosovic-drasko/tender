import { Component, Input, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, Observable, switchMap, tap } from 'rxjs';

import { IPrvorangirani } from '../prvorangirani.model';

import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, PrvorangiraniService } from '../service/prvorangirani.service';
import { FilterOptions, IFilterOptions, IFilterOption } from 'app/shared/filter/filter.model';
import { TableUtil } from '../../../tableUtil';

@Component({
  selector: 'jhi-prvorangirani',
  templateUrl: './prvorangirani.component.html',
})
export class PrvorangiraniComponent implements OnInit {
  prvorangiranis?: IPrvorangirani[];
  isLoading = false;

  predicate = 'id';
  ascending = true;
  filters: IFilterOptions = new FilterOptions();

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;
  ukupno_procjenjeno?: number;
  ukupno_ponudjeno?: number;
  @Input() postupak: any;

  constructor(protected prvorangiraniService: PrvorangiraniService, protected activatedRoute: ActivatedRoute, public router: Router) {}

  trackId = (_index: number, item: IPrvorangirani): number => this.prvorangiraniService.getPrvorangiraniIdentifier(item);

  ngOnInit(): void {
    if (this.postupak !== undefined) {
      this.loadSifraPostupka();
    } else {
      this.load();
      console.log('Postupak je >>>>>>>>', this.postupak);
    }
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.predicate, this.ascending, this.filters.filterOptions);
  }

  navigateToPage(page = this.page): void {
    this.handleNavigation(page, this.predicate, this.ascending, this.filters.filterOptions);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending, this.filters.filterOptions))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
    this.filters.initializeFromParams(params);
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.prvorangiranis = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IPrvorangirani[] | null): IPrvorangirani[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryBackend(
    page?: number,
    predicate?: string,
    ascending?: boolean,
    filterOptions?: IFilterOption[]
  ): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    filterOptions?.forEach(filterOption => {
      queryObject[filterOption.name] = filterOption.values;
    });
    return this.prvorangiraniService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page = this.page, predicate?: string, ascending?: boolean, filterOptions?: IFilterOption[]): void {
    const queryParamsObj: any = {
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    filterOptions?.forEach(filterOption => {
      queryParamsObj[filterOption.nameAsQueryParam()] = filterOption.values;
    });

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }

  loadSifraPostupka(): void {
    this.loadFromBackendWithRouteInformationsPostupak().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
        this.ukupno_procjenjeno = res.body?.reduce((acc, vrednovanje) => acc + vrednovanje.procijenjenaVrijednost!, 0);
        this.ukupno_ponudjeno = res.body?.reduce((acc, vrednovanje) => acc + vrednovanje.ponudjenaVrijednost!, 0);
      },
    });
  }
  protected loadFromBackendWithRouteInformationsPostupak(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackendPostupak(this.predicate, this.ascending))
    );
  }
  protected queryBackendPostupak(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = { 'sifraPostupka.in': this.postupak, sort: this.getSortQueryParam(predicate, ascending) };
    return this.prvorangiraniService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  exportTable() {
    TableUtil.exportTableToExcel('ExampleTable');
  }
}
