import { Component} from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-view-lobbies',
  templateUrl: './view-lobbies.component.html',
  styleUrls: ['./view-lobbies.component.css']
})
export class ViewLobbiesComponent {

  jwt: string | null;

  constructor(private jwtHelper: JwtHelperService) {
    this.jwt = sessionStorage.getItem('access_token')
  }
}
