export interface IViewPonudjaci {
  id: number;
  nazivPonudjaca?: string | null;
  sifraPostupka?: number | null;
  sifraPonude?: number | null;
}

export type NewViewPonudjaci = Omit<IViewPonudjaci, 'id'> & { id: null };
