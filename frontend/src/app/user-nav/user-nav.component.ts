import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FlaskdataService } from '../services/flaskdata.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.css']
})
export class UserNavComponent {

  joinLobbyError?: string;
  formSubmitted = false;

  constructor(
    public userService: UserServiceService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private flaskService: FlaskdataService
    ) {
      this.flaskService.findOutIfInLobby().subscribe({
        next: (data: any) => {
          if (data.response === 'true') {
            this.userService.setInLobby(true);
          }
        },
        error: (error: any) => {
          console.error('You are not in a lobby:', error);
        }
      });
    }
  
  joinPrivateLobbyForm = new FormGroup({
    privateLobbyId: new FormControl('', [
      Validators.required,
      // Validators.maxLength(4),
      // Validators.minLength(4)
    ])
  });

  ngOnInit() {}

  gotoProfile(username: string) {
    
    let reloadPage = false;
    const urlRootPath:string = this.router.url.split('/')[1];
    if(urlRootPath === "profile") {
      reloadPage = true;
    }
    this.router.navigate([`/profile`, username]).then(() => {
      if(reloadPage) {
        window.location.reload();
      }
    });

  }

  gotoMyProfile() {

    if(!this.userService.user) {
      return;
    }
    const userData = this.jwtHelper.decodeToken(this.userService.user.access_token);
    this.gotoProfile(userData.username);

  }

  userSessionActive() {
    return this.userService.user;
  }

  userInLobby() {
    return this.userService.isInLobby();
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
    this.userService.clearUser();
    localStorage.removeItem('access_token');
    console.log('Logout succesful')
    this.router.navigate(['/login']);
  }

  joinPrivateLobby(): void {

    if (this.joinPrivateLobbyForm.valid) {
      const privateLobbyId = this.joinPrivateLobbyForm.get('privateLobbyId')?.value;

      const lobbyId = { lobbyId: privateLobbyId, privateLobby: true }

      this.flaskService.joinLobby(lobbyId).subscribe({
        next: (result: any)=>{
          this.userService.setInLobby(true);
          this.router.navigate([`lobby/${privateLobbyId}`]);
        },
        error: (error: any)=>{
          console.log(JSON.stringify(error))
          this.joinLobbyError = error.error.error;
        }
      })
    }
  }
}