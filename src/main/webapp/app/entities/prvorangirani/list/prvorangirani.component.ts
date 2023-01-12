import { Component, Input, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, Observable, switchMap, tap } from 'rxjs';

import { IPrvorangirani } from '../prvorangirani.model';

import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, PrvorangiraniService } from '../service/prvorangirani.service';
import { FilterOptions, IFilterOptions, IFilterOption } from 'app/shared/filter/filter.model';
import { TableUtil } from '../../../tableUtil';
import { IViewPonudjaci } from '../../view-ponudjaci/view-ponudjaci.model';
import { ViewPonudjaciService } from '../../view-ponudjaci/service/view-ponudjaci.service';

@Component({
  selector: 'jhi-prvorangirani',
  templateUrl: './prvorangirani.component.html',
  styleUrls: ['./prvorangirani.content.scss'],
})
export class PrvorangiraniComponent implements OnInit {
  prvorangiranis?: IPrvorangirani[];
  isLoading = false;
  sifraPonude?: null;
  predicate = 'id';
  ascending = true;
  filters: IFilterOptions = new FilterOptions();

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;
  ukupno_procjenjeno?: HttpResponse<any>;
  ukupno_ponudjeno?: HttpResponse<any>;
  ponudjaci?: any;
  @Input() postupak: any;

  constructor(
    protected prvorangiraniService: PrvorangiraniService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected viewPonudjaciService: ViewPonudjaciService
  ) {}

  public resourceUrlExcelDownload = SERVER_API_URL + 'api/prvorangirani/file';
  trackId = (_index: number, item: IPrvorangirani): number => this.prvorangiraniService.getPrvorangiraniIdentifier(item);

  ngOnInit(): void {
    if (this.postupak !== undefined) {
      this.loadSifraPostupka();
      this.prvorangiraniPonudjaci();
      this.sumProcjenjeno();
      this.sumPonudjeno();
    } else {
      this.load();
    }
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
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

  protected loadPostupak(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackendPostupak(this.predicate, this.ascending))
    );
  }

  // loadPostupciPonudjaci(): void {
  //   this.loadPonudjaciPostupak().subscribe({
  //     next: (res: EntityArrayResponseType) => {
  //       this.onResponseSuccessPonudjaci(res);
  //       this.ponudjaci = res.body ?? [];
  //       console.log('To su Ponudjaci iz loadPonudjaci:----------->', this.ponudjaci);
  //     },
  //   });
  // }

  protected loadPonudjaciPostupak(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackendPostupakPonudjaci(this.predicate, this.ascending))
    );
  }

  protected queryBackendPostupakPonudjaci(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = { 'sifraPostupka.in': this.postupak, sort: this.getSortQueryParam(predicate, ascending) };
    return this.prvorangiraniService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected queryBackendPonude(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      'sifraPonude.in': this.sifraPonude,
      'sifraPostupka.in': this.postupak,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.prvorangiraniService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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

  // protected onResponseSuccessPonudjaci(response: EntityArrayResponseType): void {
  //   this.fillComponentAttributesFromResponseHeader(response.headers);
  //   const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
  //   this.ponudjaci = dataFromBody;
  // }

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

  sumPonudjeno() {
    this.prvorangiraniService.sumPonudjena(this.postupak).subscribe({
      next: (res: HttpResponse<any>) => {
        this.ukupno_ponudjeno = res;
      },
    });
  }

  sumProcjenjeno() {
    this.prvorangiraniService.sumProcjenjena(this.postupak).subscribe({
      next: (res: HttpResponse<any>) => {
        this.ukupno_procjenjeno = res;
      },
    });
  }

  Excel(): void {
    window.location.href = `${this.resourceUrlExcelDownload}/${this.postupak}`;
  }

  sumPostupciPonudePonudjeno() {
    this.prvorangiraniService.sumPostupciPonudjenaPonude(this.postupak, this.sifraPonude).subscribe({
      next: (res: HttpResponse<any>) => {
        this.ukupno_ponudjeno = res;
        console.log('ukupno po ponudjacima ponudjeno', this.ukupno_ponudjeno);
      },
    });
  }

  sumPostupciPonudeProcijenjeno() {
    this.prvorangiraniService.sumPostupciProcijenjenaPonude(this.postupak, this.sifraPonude).subscribe({
      next: (res: HttpResponse<any>) => {
        this.ukupno_procjenjeno = res;
        console.log('ukupno po ponudjacima procijenjeno', this.ukupno_procjenjeno);
      },
    });
  }

  prvorangiraniPonudjaci() {
    this.prvorangiraniService.ponudjaciPrvorangirani(this.postupak).subscribe({
      next: (res: any) => {
        this.ponudjaci = res;
        console.log('Ponudjaci su iz kraja .....', this.ponudjaci);
        console.log('Postupak je  .....', this.postupak);
      },
    });
  }

  brisiSifruPonude(): void {
    this.sifraPonude = null;
  }
}
