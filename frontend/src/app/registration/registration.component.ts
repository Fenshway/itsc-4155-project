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
    password1: '',
    password2: ''
  };

  constructor(private http:HttpClient){}
  onSubmit() {
    this.http.post('http://localhost:5000/register', this.user)
    .subscribe((result)=>{
      console.warn(result);
    });

  }
}
