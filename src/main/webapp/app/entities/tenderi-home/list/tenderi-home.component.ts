import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, Observable, switchMap, tap } from 'rxjs';

import { ITenderiHome } from '../tenderi-home.model';

import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, TenderiHomeService } from '../service/tenderi-home.service';

@Component({
  selector: 'jhi-tenderi-home',
  templateUrl: './tenderi-home.component.html',
})
export class TenderiHomeComponent implements OnInit {
  isLoading = false;
  sifra?: any;
  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.sifra = params['sifra'];
    });
  }
}
