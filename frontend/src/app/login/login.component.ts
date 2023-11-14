import { Component, ChangeDetectorRef } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { FlaskdataService } from '../services/flaskdata.service';
import { UserServiceService } from '../services/user-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ])
  })

  loginError? : string
  formSubmitted = false;

  constructor(
    private flaskService: FlaskdataService, 
    private jwtHelper: JwtHelperService, 
    private router: Router,
    private userService: UserServiceService

  ) {}

  onSubmit() {

    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      const user = { username, password }
      this.flaskService.login(user).subscribe({
        next: (result: any) => {
        if (result && result.access_token) {
          this.userService.user = result;
          localStorage.setItem('access_token', result.access_token)
  
          //testing. delete later
          console.log(this.jwtHelper.decodeToken(result.access_token.username))
  
          if (!this.jwtHelper.isTokenExpired(result.access_token)) {
            console.log('Login successful');
            this.router.navigate(['/directory']);
          } else {
            console.error('Token is expired');
          }
        } else {
          console.error('Missing access token');
        }      
      },
      error: (error: any) => {
        this.loginError = error.error.error;
      }    
      })
    } else {
      console.log('form validation failed')
    }
  }
}
