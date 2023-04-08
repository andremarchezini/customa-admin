import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication';

@Injectable({
  providedIn: 'root',
})
export class ConnectService {
  apiURL = environment.apiURL;
  headers = new HttpHeaders();
  token: string | null = null;

  constructor(private http: HttpClient, private authSvc: AuthenticationService) {}

  setAuthenticatedHeader(secure: boolean) {
    const token = this.authSvc.getToken();
    this.headers = new HttpHeaders();
    this.headers = this.headers.set('Content-Type', 'application/json');
    this.headers = this.headers.set('Accept', 'application/json');
    if (secure) {
      this.headers = this.headers.set('Authorization', `Bearer ${token}`);
    }
  }

  async getToken(email: string, password: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http
      .post(`${this.apiURL}login`, `email=${email}password=${password}`, {
        headers,
      })
      .toPromise();
  }

  async get<T = object>(uri: string, secure: boolean, params?: HttpParams) {
    this.setAuthenticatedHeader(secure);
    return await firstValueFrom(
      this.http.get<T>(`${this.apiURL}${uri}`, { headers: this.headers, params }),
    );
  }

  async create<T = object>(uri: string, data: object, secure: boolean) {
    this.setAuthenticatedHeader(secure);
    const body: string = JSON.stringify(data);
    return await firstValueFrom(
      this.http.post<T>(this.apiURL + uri, body, { headers: this.headers }),
    );
  }

  async createMultiPart(uri: string, body: FormData, secure: boolean) {
    this.setAuthenticatedHeader(secure);
    this.headers = this.headers.delete('Content-Type');
    return await firstValueFrom(this.http.post(this.apiURL + uri, body, { headers: this.headers }));
  }

  async update(uri: string, data: object, secure: boolean) {
    this.setAuthenticatedHeader(secure);
    const body: string = JSON.stringify(data);
    return this.http.put(`${this.apiURL}${uri}`, body, { headers: this.headers }).toPromise();
  }

  async updateMultiPart(uri: string, body: FormData, secure: boolean) {
    this.setAuthenticatedHeader(secure);
    this.headers = this.headers.delete('Content-Type');
    return this.http.put(`${this.apiURL}${uri}`, body, { headers: this.headers }).toPromise();
  }

  async delete(uri: string, secure: boolean) {
    this.setAuthenticatedHeader(secure);
    return this.http.delete(`${this.apiURL}${uri}`, { headers: this.headers }).toPromise();
  }

  async handleError(error: any) {
    console.error(error);
  }
}
