import { Country } from './country';
import { State } from './state';

export interface Clinician {
  id: number;
  firstName: string;
  lastName: string;
  providerNumber: string;
  practiceName: string;
  address: string;
  addressExtra: string;
  suburb: string;
  state: State;
  country: Country;
  practicePhone: string;
  practiceEmail: string;
  practiceUrl: string;
}
