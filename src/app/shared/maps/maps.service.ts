import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ConnectService } from '../connect/connect.service';
import { Place, PlaceSearch } from '../models/maps';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  apiURL = environment.apiURL;
  headers = new HttpHeaders();
  token: string | null = null;

  constructor(private connectSvc: ConnectService) {}

  async search(query: string) {
    if (query.length > 4) {
      return await this.connectSvc.get<PlaceSearch[]>(`maps/autocomplete?query=${query}`, true);
    }
  }

  async getPlace(placeId: string) {
    return await this.connectSvc.get<Place>(`maps/place?placeId=${placeId}`, true);
  }
}
