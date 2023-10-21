import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http:HttpClient){}

  onSubmit() {
    this.passwordsMatch = true;
    this.passwordLength = true;

    if (this.user.password !== this.user.confirmPassword) {
      console.error('Passwords do not match');
      this.passwordsMatch = false;
      return;
    }

    if (this.user.password.length < 8 || this.user.password.length > 64) {
      this.passwordLength = false;
      return;
    }

    this.http.post('http://localhost:5000/register', this.user)
    .subscribe((result)=>{
      console.warn(result);
    });
  }
}
