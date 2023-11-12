import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.css']
})
export class UserNavComponent {

  constructor(public userService: UserServiceService) {}

  logout () {
    sessionStorage.removeItem('access_token')
  }
  
  userSessionActive() {
    return this.userService.user;
  }

}