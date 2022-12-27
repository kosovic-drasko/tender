import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IViewPonudjaci } from '../view-ponudjaci.model';
import { ViewPonudjaciService } from '../service/view-ponudjaci.service';

import { ViewPonudjaciRoutingResolveService } from './view-ponudjaci-routing-resolve.service';

describe('ViewPonudjaci routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ViewPonudjaciRoutingResolveService;
  let service: ViewPonudjaciService;
  let resultViewPonudjaci: IViewPonudjaci | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(ViewPonudjaciRoutingResolveService);
    service = TestBed.inject(ViewPonudjaciService);
    resultViewPonudjaci = undefined;
  });

  describe('resolve', () => {
    it('should return IViewPonudjaci returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultViewPonudjaci = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultViewPonudjaci).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultViewPonudjaci = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultViewPonudjaci).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IViewPonudjaci>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultViewPonudjaci = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultViewPonudjaci).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
