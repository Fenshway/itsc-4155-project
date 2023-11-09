import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.css']
})
export class UserNavComponent {

  constructor(
    private userService: UserServiceService
    ) {}

  logout () {
    localStorage.removeItem('access_token')
  }
  
  userSessionActive() {
    return this.userService.user
  }

}