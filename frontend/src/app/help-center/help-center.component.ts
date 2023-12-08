import { Component } from '@angular/core';
import { FlaskdataService } from '../services/flaskdata.service';
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

  errorMsg? : string
  successMsg? : string

  constructor(
    private flaskService: FlaskdataService
  ) {}

  onSubmit() {
    console.log('this works')
    if (this.messageForm.valid) {
      const email = this.messageForm.get('email')?.value;
      const message = this.messageForm.get('message')?.value;

      const msg = { email: email, message: message }
      this.flaskService.sendHelpMsg(msg).subscribe({
        next: (result: any) => {
          console.log(result)
          this.successMsg = result.message;
        },
        error: (error: any) => {
          this.errorMsg = error;
        }
      })
    }  else {
      console.log('form validation failed')
    }
  }
}