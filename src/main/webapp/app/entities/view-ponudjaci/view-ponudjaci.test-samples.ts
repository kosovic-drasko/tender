import { IViewPonudjaci, NewViewPonudjaci } from './view-ponudjaci.model';

export const sampleWithRequiredData: IViewPonudjaci = {
  id: 7158,
};

export const sampleWithPartialData: IViewPonudjaci = {
  id: 72859,
  sifraPostupka: 15177,
};

export const sampleWithFullData: IViewPonudjaci = {
  id: 12923,
  nazivPonudjaca: 'Networked Roads Lake',
  sifraPostupka: 66504,
};

export const sampleWithNewData: NewViewPonudjaci = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
