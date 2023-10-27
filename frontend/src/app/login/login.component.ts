import { Component, ChangeDetectorRef } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { FlaskdataService } from '../services/flaskdata.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: any = {
    username: '',
    password: ''
  };

  constructor(
    private flaskService: FlaskdataService, 
    private jwtHelper: JwtHelperService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  onSubmit() {
    this.flaskService.login(this.user)
    .subscribe((result: any)=>{
      if (result && result.access_token) {
        sessionStorage.setItem('access_token', result.access_token)

        //testing. delete later
        console.log(this.jwtHelper.decodeToken(result.access_token.username))

        if (!this.jwtHelper.isTokenExpired(result.access_token)) {
          console.log('Login successful');
          this.cdr.detectChanges();
          this.router.navigate(['/view-lobbies']);
        } else {
          console.error('Token is expired');
        }
      } else {
        console.error('Login failed');
      }      
    });
  }
}
