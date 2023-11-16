import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/api/register`, userData, getHttpOptions());
  }
  
  login(credentials: any) {
    return this.http.post(`${this.apiBaseUrl}/api/login`, credentials, getHttpOptions());
  }

  createLobby(lobbyData: any) {
    return this.http.post(`${this.apiBaseUrl}/api/create-lobby`, lobbyData, getHttpOptions());
  }

  getLobbyById(lobbyData: any) {
    return this.http.post(`${this.apiBaseUrl}/api/get-lobby-by-id`, lobbyData, getHttpOptions());
  }

  updateProfileIcon(formData: FormData) {
    return this.http.post(`${this.apiBaseUrl}/api/profileUpdate/profileIcon`, formData, getHttpOptions());
  }

  updateRelationship(formData: FormData) {
    return this.http.post(`${this.apiBaseUrl}/api/relationship`, formData, getHttpOptions());
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
  
  getLobbiesByGameName(gameName: any) {
    return this.http.post(`${this.apiBaseUrl}/api/get-lobbies-by-name`, gameName, getHttpOptions());
  }

  getUserInfo() {
    return this.http.get(`${this.apiBaseUrl}/api/whoami`, getHttpOptions());
  }

  leaveLobby(lobbyId: any) {
    return this.http.post(`${this.apiBaseUrl}/api/leave-lobby`, lobbyId, getHttpOptions());
  }

  joinLobby(lobbyId: any) {
    return this.http.post(`${this.apiBaseUrl}/api/join-lobby`, lobbyId, getHttpOptions());
  }

  findMyLobby() {
    return this.http.get(`${this.apiBaseUrl}/api/get-my-lobby`, getHttpOptions());
  }

}
