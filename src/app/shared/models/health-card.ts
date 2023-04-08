import { AccountType } from './account-type';
import { DvaCardColour } from './dva-card-colour';

export interface HealthCard {
  id: number;
  accountType: AccountType;
  accountHolderName: string | null;
  balance: string | null;
  ihiNumber: string | null;
  ihiRecordStatus: string | null;
  medicareNumber: string | null;
  medicareExpiry: string | null;
  privateFundName: string | null;
  privateFundMembershipNumber: string | null;
  dvaNumber: string | null;
  dvaDisability: string | null;
  dvaCardColour: DvaCardColour;
  hccPensionCardNumber: string | null;
}
