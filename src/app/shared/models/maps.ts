export interface PlaceSearch {
  placeId: string;
  formattedAddress: string;
}

export interface Place {
  address: string;
  suburb: string;
  stateId: string;
  state: string;
  countryId: string;
}
