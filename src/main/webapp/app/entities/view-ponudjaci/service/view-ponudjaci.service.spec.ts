import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IViewPonudjaci } from '../view-ponudjaci.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../view-ponudjaci.test-samples';

import { ViewPonudjaciService } from './view-ponudjaci.service';

const requireRestSample: IViewPonudjaci = {
  ...sampleWithRequiredData,
};

describe('ViewPonudjaci Service', () => {
  let service: ViewPonudjaciService;
  let httpMock: HttpTestingController;
  let expectedResult: IViewPonudjaci | IViewPonudjaci[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ViewPonudjaciService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ViewPonudjaci', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    describe('addViewPonudjaciToCollectionIfMissing', () => {
      it('should add a ViewPonudjaci to an empty array', () => {
        const viewPonudjaci: IViewPonudjaci = sampleWithRequiredData;
        expectedResult = service.addViewPonudjaciToCollectionIfMissing([], viewPonudjaci);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(viewPonudjaci);
      });

      it('should not add a ViewPonudjaci to an array that contains it', () => {
        const viewPonudjaci: IViewPonudjaci = sampleWithRequiredData;
        const viewPonudjaciCollection: IViewPonudjaci[] = [
          {
            ...viewPonudjaci,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addViewPonudjaciToCollectionIfMissing(viewPonudjaciCollection, viewPonudjaci);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ViewPonudjaci to an array that doesn't contain it", () => {
        const viewPonudjaci: IViewPonudjaci = sampleWithRequiredData;
        const viewPonudjaciCollection: IViewPonudjaci[] = [sampleWithPartialData];
        expectedResult = service.addViewPonudjaciToCollectionIfMissing(viewPonudjaciCollection, viewPonudjaci);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(viewPonudjaci);
      });

      it('should add only unique ViewPonudjaci to an array', () => {
        const viewPonudjaciArray: IViewPonudjaci[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const viewPonudjaciCollection: IViewPonudjaci[] = [sampleWithRequiredData];
        expectedResult = service.addViewPonudjaciToCollectionIfMissing(viewPonudjaciCollection, ...viewPonudjaciArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const viewPonudjaci: IViewPonudjaci = sampleWithRequiredData;
        const viewPonudjaci2: IViewPonudjaci = sampleWithPartialData;
        expectedResult = service.addViewPonudjaciToCollectionIfMissing([], viewPonudjaci, viewPonudjaci2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(viewPonudjaci);
        expect(expectedResult).toContain(viewPonudjaci2);
      });

      it('should accept null and undefined values', () => {
        const viewPonudjaci: IViewPonudjaci = sampleWithRequiredData;
        expectedResult = service.addViewPonudjaciToCollectionIfMissing([], null, viewPonudjaci, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(viewPonudjaci);
      });

      it('should return initial array if no ViewPonudjaci is added', () => {
        const viewPonudjaciCollection: IViewPonudjaci[] = [sampleWithRequiredData];
        expectedResult = service.addViewPonudjaciToCollectionIfMissing(viewPonudjaciCollection, undefined, null);
        expect(expectedResult).toEqual(viewPonudjaciCollection);
      });
    });

    describe('compareViewPonudjaci', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareViewPonudjaci(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareViewPonudjaci(entity1, entity2);
        const compareResult2 = service.compareViewPonudjaci(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareViewPonudjaci(entity1, entity2);
        const compareResult2 = service.compareViewPonudjaci(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareViewPonudjaci(entity1, entity2);
        const compareResult2 = service.compareViewPonudjaci(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
