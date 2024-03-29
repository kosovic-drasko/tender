import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IViewPonude } from '../view-ponude.model';

import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, ViewPonudeService } from '../service/view-ponude.service';
import { ViewPonudeDeleteDialogComponent } from '../delete/view-ponude-delete-dialog.component';
import { FilterOptions, IFilterOptions, IFilterOption } from 'app/shared/filter/filter.model';
import { TableUtil } from '../../../tableUtil';
import { PonudeService } from '../../ponude/service/ponude.service';
import { PonudeDeleteDialogComponent } from '../../ponude/delete/ponude-delete-dialog.component';
import { IPonude } from '../../ponude/ponude.model';
import { ViewPonudjaciService } from '../../view-ponudjaci/service/view-ponudjaci.service';
import { IViewPonudjaci } from '../../view-ponudjaci/view-ponudjaci.model';
import { IPonudjaci } from '../../ponudjaci/ponudjaci.model';

@Component({
  selector: 'jhi-view-ponude',
  templateUrl: './view-ponude.component.html',
  styleUrls: ['./view-ponude.component.scss'],
})
export class ViewPonudeComponent implements OnInit, OnChanges {
  viewPonudes?: IViewPonude[];
  isLoading = false;
  sifraPonude?: null;
  predicate = 'id';
  ascending = true;
  brojObrazac?: number = 0;
  ponudjaci: IViewPonudjaci[] = [];
  ukupno_ponudjeno?: HttpResponse<any>;
  time: number = 0;
  interval: any;
  @Input() postupak: any;
  @ViewChild('fileInput') fileInput: any;
  public resourceUrlExcelDownloadPostupak = SERVER_API_URL + 'api/ponude/file';

  filters: IFilterOptions = new FilterOptions();

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  constructor(
    protected viewPonudeService: ViewPonudeService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected modalService: NgbModal,
    protected ponudeService: PonudeService,
    protected viewPonudjaciService: ViewPonudjaciService
  ) {
    this.loadPostupciPonudjaci();
  }

  trackId = (_index: number, item: IViewPonude): number => this.viewPonudeService.getViewPonudeIdentifier(item);

  delete(ponude: IPonude): void {
    const modalRef = this.modalService.open(PonudeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ponude = ponude;
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.load();
      }
    });
  }
  // ucitavanje
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
    this.viewPonudes = dataFromBody;
  }
  protected onResponseSuccessPonudjaci(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.ponudjaci = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IViewPonude[] | null): IViewPonude[] {
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
    return this.viewPonudeService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
    window.location.href = `${this.resourceUrlExcelDownloadPostupak}/${this.brojObrazac}`;
  }
  Excel(): void {
    window.location.href = `${this.resourceUrlExcelDownloadPostupak}/${this.postupak}`;
  }
  uploadFile(): any {
    const formData = new FormData();
    formData.append('files', this.fileInput.nativeElement.files[0]);
    this.ponudeService.UploadExcel(formData).subscribe(() => {
      setTimeout(() => {
        this.loadSifraPostupka();
      }, 1000);
    });
  }
  loadSifraPonude(): void {
    this.loadPonude().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }
  loadSifraPostupka(): void {
    this.loadPostupak().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
        this.sum();
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

  protected queryBackendPostupak(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = { 'sifraPostupka.in': this.postupak, sort: this.getSortQueryParam(predicate, ascending) };
    return this.viewPonudeService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }
  protected queryBackendPonude(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      'sifraPonude.in': this.sifraPonude,
      'sifraPostupka.in': this.postupak,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.viewPonudeService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  ngOnInit(): void {
    // if (this.postupak !== undefined) {

    this.loadSifraPostupka();
  }

  sum() {
    this.viewPonudeService.sum(this.postupak).subscribe({
      next: (res: HttpResponse<any>) => {
        this.ukupno_ponudjeno = res;
      },
    });
  }
  sumPostupciPonude() {
    this.viewPonudeService.sumPostupciPonude(this.postupak, this.sifraPonude).subscribe({
      next: (res: HttpResponse<any>) => {
        this.ukupno_ponudjeno = res;
        console.log('ukupno po ponudjacima', this.ukupno_ponudjeno);
      },
    });
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

  ngOnChanges(): void {
    console.log('Promjena');
  }

  deleteSelected(): void {
    this.ponudeService.deleteSelected();
    setTimeout(() => {
      this.loadSifraPostupka();
    }, 1000);
  }
  updateSelected(id: number): void {
    this.ponudeService.updateSelected(id).subscribe({
      next: (res: any) => {
        console.log('Dodato True');
      },
    });
  }

  open(contentBrisiSelect: any): any {
    this.modalService.open(contentBrisiSelect, { ariaLabelledBy: 'modal-basic-title' });
  }

  brisiSifruPonude(): void {
    this.sifraPonude = null;
  }

  deleteSifra(): void {
    this.ponudeService.deleteSifraPonude(this.sifraPonude).subscribe();
    setTimeout(() => {
      this.loadSifraPostupka();
    }, 1000);
  }

  openDeleteSifraPonude(contentBrisiPoSifriPonude: any): any {
    this.modalService.open(contentBrisiPoSifriPonude, { ariaLabelledBy: 'modal-basic-title' });
  }

  clearInputFile() {
    setTimeout(() => {
      this.loadSifraPostupka();
    }, 1000);
  }
}
