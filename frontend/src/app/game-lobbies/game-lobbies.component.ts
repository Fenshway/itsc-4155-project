import { Component } from '@angular/core';
import { FlaskdataService } from '../services/flaskdata.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-game-lobbies',
  templateUrl: './game-lobbies.component.html',
  styleUrls: ['./game-lobbies.component.css']
})
export class GameLobbiesComponent {

  lobbiesData: any;
  joinLobbyError?: string;

  constructor(
    private route: ActivatedRoute,
    private flaskService: FlaskdataService,
    private router: Router,
    private userService: UserServiceService
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

  timeSinceLobbyCreated(createdAt: string): string {
    const createdDate = new Date(createdAt);
    const currentDate = new Date()

    const seconds = Math.floor((currentDate.getTime() - createdDate.getTime()) / 1000);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    let timeSinceCreation = '';

    if (hours > 0) {
      timeSinceCreation += hours + 'h ';
    }

    if (minutes > 0 || hours === 0) {
      timeSinceCreation += minutes + 'm';
    }

    if (timeSinceCreation === '') {
      timeSinceCreation = 'Just now';
    }
    return timeSinceCreation;
  }

  navigateToLobby(id: number): void {
    const lobbyId = { lobbyId: id }
    this.flaskService.joinLobby(lobbyId).subscribe({
      next: (result: any)=>{
        this.userService.setInLobby(true);
        this.router.navigate([`lobby/${id}`]);
      },
      error: (error: any)=>{
        console.log(JSON.stringify(error))
        this.joinLobbyError = error.error.error;
      }
    })


  }

}
