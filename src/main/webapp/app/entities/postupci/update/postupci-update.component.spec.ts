import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PostupciFormService } from './postupci-form.service';
import { PostupciService } from '../service/postupci.service';
import { IPostupci } from '../postupci.model';

import { PostupciUpdateComponent } from './postupci-update.component';

describe('Postupci Management Update Component', () => {
  let comp: PostupciUpdateComponent;
  let fixture: ComponentFixture<PostupciUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let postupciFormService: PostupciFormService;
  let postupciService: PostupciService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PostupciUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PostupciUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PostupciUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    postupciFormService = TestBed.inject(PostupciFormService);
    postupciService = TestBed.inject(PostupciService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const postupci: IPostupci = { id: 456 };

      activatedRoute.data = of({ postupci });
      comp.ngOnInit();

      expect(comp.postupci).toEqual(postupci);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPostupci>>();
      const postupci = { id: 123 };
      jest.spyOn(postupciFormService, 'getPostupci').mockReturnValue(postupci);
      jest.spyOn(postupciService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ postupci });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: postupci }));
      saveSubject.complete();

      // THEN
      expect(postupciFormService.getPostupci).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(postupciService.update).toHaveBeenCalledWith(expect.objectContaining(postupci));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPostupci>>();
      const postupci = { id: 123 };
      jest.spyOn(postupciFormService, 'getPostupci').mockReturnValue({ id: null });
      jest.spyOn(postupciService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ postupci: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: postupci }));
      saveSubject.complete();

      // THEN
      expect(postupciFormService.getPostupci).toHaveBeenCalled();
      expect(postupciService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPostupci>>();
      const postupci = { id: 123 };
      jest.spyOn(postupciService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ postupci });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(postupciService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
