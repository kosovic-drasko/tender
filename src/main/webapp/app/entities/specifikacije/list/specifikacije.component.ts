import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ISpecifikacije } from '../specifikacije.model';

import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, SpecifikacijeService } from '../service/specifikacije.service';
import { SpecifikacijeDeleteDialogComponent } from '../delete/specifikacije-delete-dialog.component';
import { FilterOptions, IFilterOptions, IFilterOption } from 'app/shared/filter/filter.model';
import { TableUtil } from '../../../tableUtil';

@Component({
  selector: 'jhi-specifikacije',
  templateUrl: './specifikacije.component.html',
  styleUrls: ['./specifikacije.scss'],
})
export class SpecifikacijeComponent implements OnInit {
  specifikacijes?: ISpecifikacije[];
  isLoading = false;
  message: string | undefined;
  predicate = 'id';
  ascending = true;
  filters: IFilterOptions = new FilterOptions();
  brojObrazac?: number = 0;
  ukupno_procjenjeno?: any;
  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;
  time: number = 0;
  interval: any;
  @ViewChild('fileInput') fileInput: any;
  @Input() postupak?: number;
  public resourceUrlExcelDownload = SERVER_API_URL + 'api/specifikacije/file';
  constructor(
    protected specifikacijeService: SpecifikacijeService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: ISpecifikacije): number => this.specifikacijeService.getSpecifikacijeIdentifier(item);
  //LOAD=================================================================
  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }
  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending, this.filters.filterOptions))
    );
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
    return this.specifikacijeService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  ///////////////////////////POSTUPAK
  loadSifraPostupka(): void {
    this.loadFromBackendWithRouteInformationsPostupak().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
        // this.ukupno_procjenjeno = res.body?.reduce((acc, specifikacije) => acc + specifikacije.procijenjenaVrijednost!, 0);
      },
    });
  }

  protected loadFromBackendWithRouteInformationsPostupak(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackendPostupak(this.page, this.predicate))
    );
  }

  protected queryBackendPostupak(
    page?: number,
    predicate?: string,
    ascending?: boolean,
    filterOptions?: IFilterOption[]
  ): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject: any = {
      'sifraPostupka.in': this.postupak,
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    filterOptions?.forEach(filterOption => {
      queryObject[filterOption.name] = filterOption.values;
    });
    return this.specifikacijeService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  //////////////////////END LOADING

  ngOnInit(): void {
    if (this.postupak !== undefined) {
      this.loadSifraPostupka();
      this.sum();
      console.log('/////////', this.ukupno_procjenjeno);
      // setInterval((): void => {
      //   this.loadSifraPostupka();
      //   console.log('This will be displayed every 1000ms (1s).');
      // }, 1000);
    } else {
      this.load();
    }
  }

  delete(specifikacije: ISpecifikacije): void {
    const modalRef = this.modalService.open(SpecifikacijeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.specifikacije = specifikacije;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
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
    this.specifikacijes = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: ISpecifikacije[] | null): ISpecifikacije[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
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

  obrazacExcel(): void {
    window.location.href = `${this.resourceUrlExcelDownload}/${this.brojObrazac}`;
  }
  Excel(): void {
    window.location.href = `${this.resourceUrlExcelDownload}/${this.postupak}`;
  }
  exportArray() {
    // @ts-ignore
    const onlyNameAndSymbolArr: Partial<ISpecifikacije>[] = this.specifikacijes.map(x => ({
      'sifra postupka': x.sifraPostupka,
      broj_partije: x.brojPartije,
      atc: x.atc,
      inn: x.inn,
      'farmaceutski oblik': x.farmaceutskiOblikLijeka,
      karakteristika: x.karakteristika,
      'jacina lijeka': x.jacinaLijeka,
      'trazena kolicina': x.trazenaKolicina,
      pakovanje: x.pakovanje,
      'jedinica mjere': x.jedinicaMjere,
      'procijenjena vrijednost': x.procijenjenaVrijednost,
      'jedinicna cijena': x.jedinicnaCijena,
    }));
    TableUtil.exportArrayToExcel(onlyNameAndSymbolArr, 'Specifikacija');
  }
  uploadFile(): any {
    const formData = new FormData();
    formData.append('files', this.fileInput.nativeElement.files[0]);

    this.specifikacijeService.UploadExcel(formData).subscribe((result: { toString: () => string | undefined }) => {
      this.message = result.toString();
      this.load();
    });
  }
  sum() {
    this.specifikacijeService.sum(this.postupak).subscribe({
      next: (res: HttpResponse<any>) => {
        this.ukupno_procjenjeno = res;
      },
    });
  }
}
