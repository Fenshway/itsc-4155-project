import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private _user?: any;
  
  constructor() { }

  get user() {
    return this._user;
  }

  set user(value: any) {
    this._user = value;
  }

}
