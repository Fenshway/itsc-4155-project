import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { FlaskdataService } from '../services/flaskdata.service';
import { UserServiceService } from '../services/user-service.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password === confirmPassword) {
    return null;
  } else {
    return { passwordMismatch: true };
  }
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ])
  }, { validators: passwordMatchValidator });
  
  passwordsMatch = true;
  registrationError?: string;
  formSubmitted = false;

  constructor(
    private flaskService: FlaskdataService, 
    private jwtHelper: JwtHelperService, 
    private router: Router,
    private userService: UserServiceService
    ) {}

  onSubmit() {
    // Reset validation flags
    if (this.registerForm.valid) {
      const username = this.registerForm.get('username')?.value;
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;

      const user = { username, email, password }

    // Registration request
    this.flaskService.register(user).subscribe({
      next: (result: any) => {
        console.log(result)
        if (result && result.access_token) {
          this.userService.user = result;
          localStorage.setItem('access_token', result.access_token)
          const userData = this.jwtHelper.decodeToken(result.access_token);

          //testing. delete later
          console.log(this.jwtHelper.decodeToken(result.access_token.username))
  
          if (!this.jwtHelper.isTokenExpired(result.access_token)) {
            console.log('Registration and login successful');
            

            this.router.navigate([`/profile/${userData.username}`]);
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
  } else {
    console.log('form validation failed')
  }
  }
}
