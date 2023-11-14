import { Injectable } from '@angular/core';
import { FlaskdataService } from './flaskdata.service';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private _user?: any;
  
  constructor(
    private flaskdataService: FlaskdataService
  ) { 
    const userSession = localStorage.getItem("access_token");

    if(userSession) {
      this.flaskdataService.getUserInfo().subscribe({
        next: (result: any)=>{
          console.log(result)
          this._user = result;
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

}
