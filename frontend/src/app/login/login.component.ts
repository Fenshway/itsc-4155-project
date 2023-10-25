import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

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

  constructor(private http:HttpClient, private jwtHelper: JwtHelperService){}
  onSubmit() {
    this.http.post('http://localhost:5000/api/login', this.user)
    .subscribe((result: any)=>{
      if (result && result.access_token) {
        localStorage.setItem('access_token', result.access_token)

        //testing. delete later
        console.log(this.jwtHelper.decodeToken(result.access_token.username))

        if (!this.jwtHelper.isTokenExpired(result.access_token)) {
          console.log('Login successful');
        } else {
          console.error('Token is expired');
        }
      } else {
        console.error('Login failed');
      }      
    });
  }
}
