import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { FlaskdataService } from '../services/flaskdata.service';

@Component({
  selector: 'app-view-lobbies',
  templateUrl: './view-lobbies.component.html',
  styleUrls: ['./view-lobbies.component.css']
})
export class ViewLobbiesComponent {
  gameData: any[] = [];

  constructor(
    private userService: UserServiceService,
    private flaskService: FlaskdataService
  ) {}

  ngOnInit(): void {
    this.flaskService.getGames()
    .subscribe((data: any) => {
      this.gameData = data;
    });
  }

}
