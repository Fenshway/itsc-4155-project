import { Component } from '@angular/core';
import { FlaskdataService } from '../services/flaskdata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-lobbies',
  templateUrl: './view-lobbies.component.html',
  styleUrls: ['./view-lobbies.component.css']
})
export class ViewLobbiesComponent {
  gameData: any[] = [];

  constructor(
    private flaskService: FlaskdataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.flaskService.getGames()
    .subscribe((data: any) => {
      this.gameData = data;
    });
  }

  navigateToGameLobbies(gameName: string): void {
    const formattedGameName = gameName.toLowerCase().replace(/\s+/g, '-');
    this.router.navigate([`directory/${formattedGameName}`]);
  }

}
