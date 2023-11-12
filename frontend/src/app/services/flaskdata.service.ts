import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

function getHttpOptions() {
  return {
    headers: {"Authorization": sessionStorage.getItem("access_token") || ""}
  }
}

@Injectable({
  providedIn: 'root'
})
export class FlaskdataService {
  private apiBaseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  getTestData() {
    return this.http.get(`${this.apiBaseUrl}/api/testdata`, getHttpOptions());
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/api/register`, userData, getHttpOptions());
  }
  
  login(credentials: any) {
    return this.http.post(`${this.apiBaseUrl}/api/login`, credentials, getHttpOptions());
  }

  createLobby(lobbyData: any) {
    return this.http.post(`${this.apiBaseUrl}/api/create-lobby`, lobbyData, getHttpOptions());
  }

  updateProfileIcon(formData: FormData) {
    return this.http.post(`${this.apiBaseUrl}/api/profileUpdate/profileIcon`, formData, getHttpOptions());
  }

  updateLibrary(formData: FormData) {
    return this.http.post(`${this.apiBaseUrl}/api/profileUpdate/library`, formData, getHttpOptions());
  }

  getProfile(username: string) {
    return this.http.get(`${this.apiBaseUrl}/api/profile/` + username, getHttpOptions());
  }

  getGames() {
    return this.http.get(`${this.apiBaseUrl}/api/games`, getHttpOptions());
  }

}
