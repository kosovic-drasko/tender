import { Component, Input, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, Observable, switchMap, tap } from 'rxjs';

import { IVrednovanje } from '../vrednovanje.model';

import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, VrednovanjeService } from '../service/vrednovanje.service';
import { FilterOptions, IFilterOptions, IFilterOption } from 'app/shared/filter/filter.model';
import { TableUtil } from '../../../tableUtil';
import { IViewPonudjaci } from '../../view-ponudjaci/view-ponudjaci.model';
import { ViewPonudjaciService } from '../../view-ponudjaci/service/view-ponudjaci.service';

@Component({
  selector: 'jhi-vrednovanje',
  templateUrl: './vrednovanje.component.html',
})
export class VrednovanjeComponent implements OnInit {
  vrednovanjes?: IVrednovanje[];
  ukupno_procjenjeno?: HttpResponse<any>;
  ukupno_ponudjeno?: HttpResponse<any>;
  isLoading = false;
  sifraPonude?: number;
  ponudjaci: IViewPonudjaci[] = [];
  predicate = 'id';
  ascending = true;
  filters: IFilterOptions = new FilterOptions();

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;
  @Input() postupak: any;
  constructor(
    protected vrednovanjeService: VrednovanjeService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected viewPonudjaciService: ViewPonudjaciService
  ) {
    this.loadPostupciPonudjaci();
  }
  public resourceUrlExcelDownload = SERVER_API_URL + 'api/vrednovanje/file';
  trackId = (_index: number, item: IVrednovanje): number => this.vrednovanjeService.getVrednovanjeIdentifier(item);

  ngOnInit(): void {
    // if (this.postupak !== undefined) {
    //   this.loadSifraPostupka();
    //   this.sumPonudjena();
    //   this.sumProcjenjena();
    //
    // } else {
    //   this.load();
    // }

    this.loadSifraPostupka();
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
    this.vrednovanjes = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IVrednovanje[] | null): IVrednovanje[] {
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
    return this.vrednovanjeService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
    return this.vrednovanjeService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  exportTable() {
    TableUtil.exportTableToExcel('ExampleTable');
  }

  Excel(): void {
    window.location.href = `${this.resourceUrlExcelDownload}/${this.postupak}`;
  }

  protected onResponseSuccessPonudjaci(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.ponudjaci = dataFromBody;
  }

  loadPostupciPonudjaci(): void {
    this.loadPonudjaciPostupak().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccessPonudjaci(res);
        this.ponudjaci = res.body ?? [];
        // this.sumPostupciPonude();
        console.log('To su Ponudjaci iz loadPonudjaci:----------->', this.ponudjaci);
        // console.log('Ukupno je ..............', this.ukupno_ponudjeno);
      },
    });
  }
  protected loadPonudjaciPostupak(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackendPostupakPonudjaci())
    );
  }
  protected queryBackendPostupakPonudjaci(): Observable<EntityArrayResponseType> {
    const queryObject = { 'sifraPostupka.in': this.postupak };
    return this.viewPonudjaciService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  loadSifraPonude(): void {
    this.loadPonude().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  protected loadPonude(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackendPonude(this.predicate, this.ascending))
    );
  }

  protected queryBackendPonude(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      'sifraPonude.in': this.sifraPonude,
      'sifraPostupka.in': this.postupak,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.vrednovanjeService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }
}
