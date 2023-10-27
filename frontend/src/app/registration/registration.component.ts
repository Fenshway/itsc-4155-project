import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { FlaskdataService } from '../services/flaskdata.service';
import { catchError } from 'rxjs';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  user: any = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  passwordsMatch = true;
  passwordLength = true;
  registrationError?: string;

  constructor(
    private flaskService: FlaskdataService, 
    private jwtHelper: JwtHelperService, 
    private router: Router,
    private userService: UserServiceService
    ) {}

  onSubmit() {
    // Reset validation flags
    this.passwordsMatch = true;
    this.passwordLength = true;

    // Check if passwords match
    if (this.user.password !== this.user.confirmPassword) {
      console.error('Passwords do not match');
      this.passwordsMatch = false;
      return;
    }
    
    // Check password length
    if (this.user.password.length < 8 || this.user.password.length > 64) {
      console.error('Password must be at least 8 characters');
      this.passwordLength = false;
      return;
    }

    // Registration request
    this.flaskService.register(this.user).subscribe({
      next: (result: any) => {
        console.log(result)
        if (result && result.access_token) {
          this.userService.user = result;
          sessionStorage.setItem('access_token', result.access_token)
  
          //testing. delete later
          console.log(this.jwtHelper.decodeToken(result.access_token.username))
  
          if (!this.jwtHelper.isTokenExpired(result.access_token)) {
            console.log('Registration and login successful');
            

            this.router.navigate(['/profile']);
          } else {
            console.error('Token is expired');
          }
        } else {
          console.error('Missing access token');
        }      
      },
      error: (error: any) => {
        console.log(JSON.stringify(error))
        this.registrationError = error.error.error;
        console.error('Registration failed')
      }
    })
  }
}
