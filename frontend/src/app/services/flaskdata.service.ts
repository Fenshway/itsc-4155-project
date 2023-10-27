import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

function getHttpOptions() {
  return {
    headers: {"Authorization": localStorage.getItem("access_token") || ""}
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

  register(userData: any) {
    return this.http.post(`${this.apiBaseUrl}/api/register`, userData, getHttpOptions());
  }

  login(credentials: any) {
    return this.http.post(`${this.apiBaseUrl}/api/login`, credentials, getHttpOptions());
  }

  createLobby(lobbyData: any) {
    return this.http.post(`${this.apiBaseUrl}/api/login`, lobbyData, getHttpOptions());
  }

  updateProfilePicture(formData: FormData) {
    return this.http.post(`${this.apiBaseUrl}/api/updateProfileIcon`, formData, getHttpOptions());
  }

}
