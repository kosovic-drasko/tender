import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IViewPonudjaci } from '../view-ponudjaci.model';

@Component({
  selector: 'jhi-view-ponudjaci-detail',
  templateUrl: './view-ponudjaci-detail.component.html',
})
export class ViewPonudjaciDetailComponent implements OnInit {
  viewPonudjaci: IViewPonudjaci | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ viewPonudjaci }) => {
      this.viewPonudjaci = viewPonudjaci;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
