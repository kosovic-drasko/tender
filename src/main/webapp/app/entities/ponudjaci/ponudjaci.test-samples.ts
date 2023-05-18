import { IPonudjaci, NewPonudjaci } from './ponudjaci.model';

export const sampleWithRequiredData: IPonudjaci = {
  id: 58649,
  nazivPonudjaca: 'system-worthy withdrawal',
};

export const sampleWithPartialData: IPonudjaci = {
  id: 54097,
  nazivPonudjaca: 'gold withdrawal',
  adresaPonudjaca: 'distributed up Intelligent',
  bankaRacun: 'monetize',
};

export const sampleWithFullData: IPonudjaci = {
  id: 63886,
  nazivPonudjaca: 'Valley Planner',
  odgovornoLice: 'green Loan Technician',
  adresaPonudjaca: 'Table',
  bankaRacun: 'Sleek Libyan Chair',
};

export const sampleWithNewData: NewPonudjaci = {
  nazivPonudjaca: 'overriding Enhanced Unions',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
