import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPonude } from '../ponude.model';
import { PonudeService } from '../service/ponude.service';
import { PonudeDeleteDialogComponent } from '../delete/ponude-delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { IPostupci } from 'app/entities/postupci/postupci.model';
import { PonudeUpdateComponent } from '../update/ponude-update.component';

@Component({
  selector: 'jhi-ponude',
  templateUrl: './ponude.component.html',
  styleUrls: ['./ponude.component.scss'],
})
export class PonudeComponent implements AfterViewInit, OnInit {
  ponudes?: HttpResponse<IPonude[]>;
  postupci?: IPostupci[];
  sifraPonudjaca?: number;
  account: Account | null = null;
  login: any;
  ukupnaPonudjena?: number | null | undefined;
  sifraPostupka?: any;
  sifraPonude?: any;
  brojPartije?: any;
  brojObrazac?: number = 0;
  isLoading = false;
  aktivno?: boolean;
  id?: number;
  index?: number;
  unos?: any;
  public displayedColumns = [
    'sifra postupka',
    'sifraPonude',
    'brojPartije',
    'naziv proizvodjaca',
    'zasticeni naziv',
    'ponudjena vrijednost',
    'sifra ponudjaca',
    'jedinicna cijena',
    'rok isporuke',
    // 'kreirao',
    // 'datum kreiranja',
    // 'zadnji izmjenio',
    // 'selected',
    'edit',
    'delete',
  ];

  public dataSource = new MatTableDataSource<IPonude>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() postupak?: any;
  @ViewChild('fileInput') fileInput: any;

  constructor(
    protected ponudeService: PonudeService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    private accountService: AccountService,
    protected dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ oznaka }) => {
      this.unos = oznaka;
    });

    if (this.unos === 'unosi') {
      this.loadAll();
    } else {
      this.getSifraPostupka();
    }
  }

  getSifraPostupka(): void {
    this.isLoading = true;
    this.ponudeService
      .query({
        'sifraPostupka.in': this.postupak,
      })
      .subscribe({
        next: (res: HttpResponse<IPonude[]>) => {
          this.isLoading = false;
          this.dataSource.data = res.body ?? [];
          this.ponudes = res;
          this.getTotalPonudjana();
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
  loadAll(): void {
    this.ponudeService.query().subscribe((res: HttpResponse<IPonude[]>) => {
      this.dataSource.data = res.body ?? [];
      this.getTotalPonudjana();
    });
  }
  nadjiPonudjaci(): void {
    this.isLoading = true;
    this.ponudeService
      .query({
        'sifraPonudjaca.in': this.sifraPonudjaca,
      })
      .subscribe({
        next: (res: HttpResponse<IPonude[]>) => {
          this.isLoading = false;
          this.dataSource.data = res.body ?? [];
          this.ponudes = res;
          this.getTotalPonudjana();
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
  public nadjiPoPartiji(): void {
    this.isLoading = true;
    this.ponudeService
      .query({
        'brojPartije.in': this.brojPartije,
      })
      .subscribe({
        next: (res: HttpResponse<IPonude[]>) => {
          this.isLoading = false;
          this.dataSource.data = res.body ?? [];
          this.getTotalPonudjana();
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
  nadjiPoSifriPonude(): void {
    this.isLoading = true;
    this.ponudeService
      .query({
        'sifraPonude.in': this.sifraPonude,
      })
      .subscribe({
        next: (res: HttpResponse<IPonude[]>) => {
          this.isLoading = false;
          this.dataSource.data = res.body ?? [];
          this.getTotalPonudjana();
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  sifraPonudeNull(): void {
    this.sifraPonude = null;
    this.sifraPonude = '';
    this.getSifraPostupka();
  }
  brojPartijeNull(): void {
    this.brojPartije = null;
    this.brojPartije = '';
    this.getSifraPostupka();
  }
  startEdit(
    id?: number,
    sifraPostupka?: number,
    sifraPonude?: number,
    brojPartije?: number,
    sifraPonudjaca?: string | null,
    nazivProizvodjaca?: string | null,
    zasticeniNaziv?: string | null,
    ponudjenaVrijednost?: number,
    jedinicnaCijena?: number,
    rokIsporuke?: number
  ): any {
    const dialogRef = this.dialog.open(PonudeUpdateComponent, {
      data: {
        id,
        sifraPostupka,
        sifraPonude,
        brojPartije,
        sifraPonudjaca,
        nazivProizvodjaca,
        zasticeniNaziv,
        ponudjenaVrijednost,
        jedinicnaCijena,
        rokIsporuke,

        name: (this.aktivno = true),
      },
    });
    dialogRef.afterClosed().subscribe(
      // eslint-disable-next-line no-console
      () =>
        this.ponudeService.query().subscribe((res: HttpResponse<IPonude[]>) => {
          this.dataSource.data = res.body ?? [];
        })
    );
  }

  addNew(): any {
    const dialogRef = this.dialog.open(PonudeUpdateComponent, {
      data: { Ponude: {}, name: (this.aktivno = false) },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getTotalPonudjana;
      if (this.unos === 'unosi') {
        this.loadAll();
        setTimeout(() => {
          this.loadAll();
        }, 1000);
      } else {
        this.getSifraPostupka();
        setTimeout(() => {
          this.getSifraPostupka();
        }, 1000);
      }
    });
  }

  getTotalPonudjana(): any {
    return (this.ukupnaPonudjena = this.dataSource.filteredData.map(t => t.ponudjenaVrijednost).reduce((acc, value) => acc! + value!, 0));
  }
  deleteSelected(): void {
    this.ponudeService.deleteSelected();
    this.getSifraPostupka();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }
  uploadFile(): any {
    const formData = new FormData();
    formData.append('files', this.fileInput.nativeElement.files[0]);
    this.ponudeService.UploadExcel(formData).subscribe(() => {
      this.getTotalPonudjana();
      this.loadAll();
    });
  }
  deleteItem(i: number, id: number): void {
    this.index = i;
    this.id = id;
    this.dialog.open(PonudeDeleteDialogComponent, {
      data: { id },
    });
    this.dialog.afterAllClosed.subscribe(() => {
      this.getTotalPonudjana();
      if (this.unos === 'unosi') {
        this.loadAll();
      } else {
        this.getSifraPostupka();
      }
    });
  }

  public resourceUrlExcelDownload = SERVER_API_URL + 'api/ponude/file';

  downloadExcel(): void {
    window.location.href = `${this.resourceUrlExcelDownload}/${this.postupak}`;
  }
  obrazacExcel(): void {
    window.location.href = `${this.resourceUrlExcelDownload}/${this.brojObrazac}`;
  }

  deleteSifra(): void {
    this.ponudeService.deleteSifraPonude(this.sifraPonude).subscribe();
    this.getSifraPostupka();
  }
  open(contentBrisiSelect: any): any {
    this.modalService.open(contentBrisiSelect, { ariaLabelledBy: 'modal-basic-title' });
  }
  open1(contentBrisiPoSifriPonude: any): any {
    this.modalService.open(contentBrisiPoSifriPonude, { ariaLabelledBy: 'modal-basic-title' });
  }
}
