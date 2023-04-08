import { Country } from './country';
import { State } from './state';
import { Gender } from './gender';
import { MaritalStatus } from './marital-status';
import { Title } from './title';
import { EmergencyContact } from './emergency-contact';

export interface Profile {
  id: number;
  title: Title;
  firstName: string;
  middleName: string | null;
  lastName: string;
  knownAs: string | null;
  uniqueMedicalRecordNumber: string | null;
  maidenName: string | null;
  maritalStatus: MaritalStatus | null;
  dateOfBirth: string;
  gender: Gender | null;
  homePhone: string | null;
  workPhone: string | null;
  mobile: string | null;
  address: string | null;
  addressExtra: string | null;
  suburb: string | null;
  state: State | null;
  country: Country | null;
  emergencyContact: EmergencyContact;
}
