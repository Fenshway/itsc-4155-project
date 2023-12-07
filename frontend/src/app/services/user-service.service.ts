import { Injectable } from '@angular/core';
import { FlaskdataService } from './flaskdata.service';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private _user?: any;
  private _inLobby: boolean = false;
  
  constructor(
    private flaskdataService: FlaskdataService
  ) { 
    const userSession = localStorage.getItem("access_token");

    if(userSession) {
      this.flaskdataService.getUserInfo().subscribe({
        next: (result: any)=>{
          console.log(result)
          this._user = {result};
        },
        error: (error: any)=>{
          console.log(error)
        }
      })
    }
  }

  get user() {
    return this._user;
  }

  set user(value: any) {
    this._user = value;
  }

  clearUser() {
    this._user = undefined;
  }

  isInLobby(): boolean {
    return this._inLobby;
  }

  setInLobby(value: boolean): void {
    this._inLobby = value;
  }

  clearInLobby() {
    this._inLobby = false;
  }

}
