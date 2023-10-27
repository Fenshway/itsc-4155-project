import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  jwt: string | null;

  constructor(private jwtHelper: JwtHelperService) {
    this.jwt = sessionStorage.getItem('access_token')
  }
}
