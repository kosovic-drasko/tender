import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PonudeFormService, PonudeFormGroup } from './ponude-form.service';
import { IPonude } from '../ponude.model';
import { PonudeService } from '../service/ponude.service';
import { IPonudjaci } from '../../ponudjaci/ponudjaci.model';
import { PonudjaciService } from '../../ponudjaci/service/ponudjaci.service';

@Component({
  selector: 'jhi-ponude-update',
  templateUrl: './ponude-update.component.html',
})
export class PonudeUpdateComponent implements OnInit {
  isSaving = false;
  ponude: IPonude | null = null;
  ponudjaci: IPonudjaci[] = [];
  editForm: PonudeFormGroup = this.ponudeFormService.createPonudeFormGroup();

  constructor(
    protected ponudeService: PonudeService,
    protected ponudeFormService: PonudeFormService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected ponudjaciService: PonudjaciService
  ) {}

  ngOnInit(): void {
    this.loadAllPonudjaci();

    this.activatedRoute.data.subscribe(({ ponude }) => {
      this.ponude = ponude;
      if (ponude) {
        this.updateForm(ponude);
        this.loadAllPonudjaci();
      }
    });
  }
  loadAllPonudjaci(): void {
    this.ponudjaciService.query().subscribe((res: HttpResponse<IPonudjaci[]>) => {
      this.ponudjaci = res.body ?? [];
      console.log('To su Ponudjaci iz loadPonudjaci:----------->', this.ponudjaci);
    });
  }
  previousState(): void {
    // this.router.navigate(['/view-ponude']);
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ponude = this.ponudeFormService.getPonude(this.editForm);
    if (ponude.id !== null) {
      this.subscribeToSaveResponse(this.ponudeService.update(ponude));
    } else {
      this.subscribeToSaveResponse(this.ponudeService.create(ponude));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPonude>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(ponude: IPonude): void {
    this.ponude = ponude;
    this.ponudeFormService.resetForm(this.editForm, ponude);
  }
}
