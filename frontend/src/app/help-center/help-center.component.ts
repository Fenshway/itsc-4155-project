import { Component, ChangeDetectorRef } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { FlaskdataService } from '../services/flaskdata.service';
import { UserServiceService } from '../services/user-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.css']
})
export class HelpCenterComponent {

  messageForm = new FormGroup({
    emailUser: new FormControl('', [
      Validators.required,
      Validators.minLength(10)
    ]),
    message: new FormControl('', [
      Validators.required,
      Validators.minLength(25)
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

    if (this.messageForm.valid) {
      const email = this.messageForm.get('emailUser')?.value;
      const message = this.messageForm.get('message')?.value;

      const msg = { email, message }
      this.flaskService.sendHelpMsg(msg).subscribe({
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
