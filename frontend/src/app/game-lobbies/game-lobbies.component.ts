import { Component } from '@angular/core';
import { FlaskdataService } from '../services/flaskdata.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-game-lobbies',
  templateUrl: './game-lobbies.component.html',
  styleUrls: ['./game-lobbies.component.css']
})
export class GameLobbiesComponent {

  lobbiesData: any;

  constructor(
    private route: ActivatedRoute,
    private flaskService: FlaskdataService,
    private router: Router,
  ) {}
  

  ngOnInit() {
    this.route.params.subscribe(params => {
      const gameName = params['gameName']
      const requestedLobbies = { requestedLobbies: gameName };

      this.flaskService.getLobbiesByGameName(requestedLobbies).subscribe({
        next: (data: any) => {
          this.lobbiesData = data;
          console.log('Lobbies data', this.lobbiesData);
        },
        error: (error: any) => {
          console.error('Failed to load lobby data:', error);
          this.router.navigate(['/directory']);
        }
      });
    })
  }
}
