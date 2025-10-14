
export const BRANDS = {
  elcomercio: 'elcomercio',
  // gestion: 'gestion',
  // clubelcomercio: 'clubelcomercio'
}

export type Brand = (typeof BRANDS)[keyof typeof BRANDS]

export enum Brands {
  ELCOMERCIO = 'elcomercio',
  // GESTION = 'gestion',
  // CLUBELCOMERCIO = 'clubelcomercio'
}
