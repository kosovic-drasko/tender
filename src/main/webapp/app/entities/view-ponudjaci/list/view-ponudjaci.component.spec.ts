import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ViewPonudjaciService } from '../service/view-ponudjaci.service';

import { ViewPonudjaciComponent } from './view-ponudjaci.component';

describe('ViewPonudjaci Management Component', () => {
  let comp: ViewPonudjaciComponent;
  let fixture: ComponentFixture<ViewPonudjaciComponent>;
  let service: ViewPonudjaciService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'view-ponudjaci', component: ViewPonudjaciComponent }]), HttpClientTestingModule],
      declarations: [ViewPonudjaciComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
                'filter[someId.in]': 'dc4279ea-cfb9-11ec-9d64-0242ac120002',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ViewPonudjaciComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ViewPonudjaciComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ViewPonudjaciService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.viewPonudjacis?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to viewPonudjaciService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getViewPonudjaciIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getViewPonudjaciIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
