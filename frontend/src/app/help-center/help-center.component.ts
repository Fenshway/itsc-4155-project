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
    email: new FormControl('', [
      Validators.required

    ]),
    message: new FormControl('', [
      Validators.required

    ])
  })

  error? : string

  constructor(
    private flaskService: FlaskdataService, 
    private jwtHelper: JwtHelperService, 
    private router: Router,
    private userService: UserServiceService

  ) {}

  onSubmit() {
    if (this.messageForm.valid) {
      const email = this.messageForm.get('email')?.value;
      const message = this.messageForm.get('message')?.value;

      const msg = { email: email, message: message }
      this.flaskService.sendHelpMsg(msg).subscribe({
        next: (result: any) => {
          console.log(result)
        },
        error: (error: any) => {
          this.error = error.error.error;
        }
      })
    }  else {
      console.log('form validation failed')
    }
  }
}