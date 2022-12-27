import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ViewPonudjaciDetailComponent } from './view-ponudjaci-detail.component';

describe('ViewPonudjaci Management Detail Component', () => {
  let comp: ViewPonudjaciDetailComponent;
  let fixture: ComponentFixture<ViewPonudjaciDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPonudjaciDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ viewPonudjaci: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ViewPonudjaciDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ViewPonudjaciDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load viewPonudjaci on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.viewPonudjaci).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
