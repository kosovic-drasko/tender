import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IViewPonude } from '../view-ponude.model';

import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { PonudeService } from '../../ponude/service/ponude.service';
import { IPonude } from '../../ponude/ponude.model';

@Component({
  templateUrl: './view-ponude-delete-dialog.component.html',
})
export class ViewPonudeDeleteDialogComponent {
  Ponude?: IPonude;

  constructor(protected PonudeService: PonudeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.PonudeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
