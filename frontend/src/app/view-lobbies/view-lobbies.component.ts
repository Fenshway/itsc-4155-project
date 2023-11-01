import { Component} from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-view-lobbies',
  templateUrl: './view-lobbies.component.html',
  styleUrls: ['./view-lobbies.component.css']
})
export class ViewLobbiesComponent {

  constructor(
    private jwtHelper: JwtHelperService,
    private userService: UserServiceService
    
  ) {}

  userSessionActive() {
    return this.userService.user
  }
}
