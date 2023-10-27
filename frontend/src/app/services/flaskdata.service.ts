import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FlaskdataService {
  private apiBaseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  getTestData() {
    return this.http.get(`${this.apiBaseUrl}/api/testdata`);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/api/register`, userData);
  }

  login(credentials: any) {
    return this.http.post(`${this.apiBaseUrl}/api/login`, credentials);
  }

  createLobby(lobbyData: any) {
    return this.http.post(`${this.apiBaseUrl}/api/login`, lobbyData);
  }
}
