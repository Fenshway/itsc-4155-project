import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FlaskdataService } from '../services/flaskdata.service';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.css']
})
export class UserNavComponent {

  constructor(
    public userService: UserServiceService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private flaskService: FlaskdataService
    ) {}

  gotoProfile() {
    if(!this.userService.user) {
      return;
    }
    const userData = this.jwtHelper.decodeToken(this.userService.user.access_token);
    let reloadPage = false;
    const urlRootPath:string = this.router.url.split('/')[1];
    if(urlRootPath === "profile") {
      reloadPage = true;
    }
    this.router.navigate([`/profile`, userData.username]).then(() => {
      if(reloadPage) {
        window.location.reload();
      }
    });
  }

  userSessionActive() {
    return this.userService.user;
  }

  isBouncing: boolean = true;

  // ngOnInit() {
  //   this.isBouncing = true;
  //   setInterval(() => {
  //     this.toggleBouncing();
  //   }, 10000);
  // }

  // toggleBouncing() {
  //   this.isBouncing = !this.isBouncing;
  // }


  navigateToMyLobby(): void {

    this.flaskService.findMyLobby().subscribe({
      next: (data: any) => {
        const actualLobbyId = data.lobbyId;
        console.log(actualLobbyId)
        this.router.navigate([`lobby/${actualLobbyId}`]);
      },
      error: (error: any) => {
        console.error('You are not in a lobby:', error);
        this.router.navigate(['/directory']);
      }
    });
  }

  logout() {
    console.log('Click')
    this.userService.clearUser();
    localStorage.removeItem('access_token');
    console.log('Logout succesful')
    this.router.navigate(['/login']);
  }

}