import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http:HttpClient){}
  onSubmit() {
    this.http.post('http://localhost:5000/login', this.user)
    .subscribe((result)=>{
      console.warn(result);
    });

  }
}
