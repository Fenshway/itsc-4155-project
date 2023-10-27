import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserServiceService } from './services/user-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  constructor(
    private jwtHelper: JwtHelperService,
    private userService: UserServiceService
  ) {}

  userSessionActive() {
    return this.userService.user
  }
}
