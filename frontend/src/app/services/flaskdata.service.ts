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
    return this.http.post(`${this.apiBaseUrl}/api/login`, lobbyData, getHttpOptions());
  }

  updateProfilePicture(formData: FormData) {
    return this.http.post(`${this.apiBaseUrl}/api/profile`, formData, getHttpOptions());
  }

  getProfile(user_id: number) {
    return this.http.get(`${this.apiBaseUrl}/api/profile/` + user_id, getHttpOptions());
  }

}
