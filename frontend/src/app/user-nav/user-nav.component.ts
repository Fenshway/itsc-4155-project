import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.css']
})
export class UserNavComponent {

  constructor(
    public userService: UserServiceService,
    private router: Router,
    private jwtHelper: JwtHelperService) { }

  logout() {
    sessionStorage.removeItem('access_token')
  }

  gotoProfile() {
    if (!this.userService.user) {
      return;
    }
    const userData = this.jwtHelper.decodeToken(this.userService.user.access_token);
    this.router.navigate([`/profile/${userData.username}`]);
  }

  userSessionActive() {
    return this.userService.user;
  }

  isBouncing: boolean = false;

  ngOnInit() {
    this.isBouncing = true;
    setInterval(() => {
      this.toggleBouncing();
    }, 10000);
  }

  toggleBouncing() {
    this.isBouncing = !this.isBouncing;
  }

}