import { Country } from './country';

export interface Clinician {
  id: number;
  firstName: string;
  lastName: string;
  providerNumber: string;
  practiceName: string;
  address: string;
  addressExtra: string;
  suburb: string;
  state: string;
  country: Country;
  practicePhone: string;
  practiceEmail: string;
  practiceUrl: string;
}
