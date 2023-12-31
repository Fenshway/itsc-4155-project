import { Injectable } from '@angular/core';
import { FlaskdataService } from './flaskdata.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private _user?: any;
  private _inLobby: boolean = false;
  public userData: any;
  
  constructor(
    private flaskdataService: FlaskdataService,
    private jwtHelper : JwtHelperService,
  ) {
    const userSession = localStorage.getItem("access_token");
    this.user = {
      "access_token": userSession,
    };
    /**
     * if(userSession) {
      this.flaskdataService.getUserInfo().subscribe({
        next: (result: any)=>{
          this._user = {result};
        },
        error: (error: any)=>{
          console.log(error)
        }
      })
    }
     */
  }

  get user() {
    return this._user;
  }

  set user(value: any) {
    if(!value || !value.access_token){return;}
    const decodedData = this.jwtHelper.decodeToken(value.access_token);
    if(!decodedData){return;}
    if(decodedData.error){
      localStorage.removeItem("access_token");
      return;
    }
    this._user = value;
    this.userData = decodedData;
    this.userData["friends"] = [];
    this.flaskdataService.getUserFriends().subscribe((data: any) => {
      this.userData["friends"] = data.friends;
    });
  }

  clearUser() {
    this._user = undefined;
    this.userData = undefined;
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
