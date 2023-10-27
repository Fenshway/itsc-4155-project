import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FlaskdataService {
  private apiBaseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  getTestData() {
    return this.http.get(`${this.apiBaseUrl}/api/testdata`);
  }

  register(userData: any) {
    return this.http.post(`${this.apiBaseUrl}/api/register`, userData);
  }

  login(credentials: any) {
    return this.http.post(`${this.apiBaseUrl}/api/login`, credentials);
  }

  createLobby(lobbyData: any) {
    return this.http.post(`${this.apiBaseUrl}/api/login`, lobbyData);
  }

  updateProfilePicture(formData: FormData) {
    return this.http.post(`${this.apiBaseUrl}/api/updateProfileIcon`, formData);
  }

}
