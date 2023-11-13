import { Component } from '@angular/core';
import { FlaskdataService } from '../services/flaskdata.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.component.html',
  styleUrls: ['./create-lobby.component.css']
})
export class CreateLobbyComponent {
  gameData: any[] = [];

  createLobbyForm = new FormGroup({
    title: new FormControl('', [
      Validators.required
    ]),
    game: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('', [
      Validators.required
    ]),
    lobbySize: new FormControl('', [
      Validators.required,
      Validators.max(10),
      Validators.min(2)
    ])
  });

  createLobbyError?: string;
  formSubmitted = false;

  constructor(
    private flaskService: FlaskdataService,
    private router: Router,
    private jwtHelper : JwtHelperService
    ) {}

  ngOnInit(): void {
    this.flaskService.getGames()
    .subscribe((data: any) => {
      this.gameData = data;
    });
  }

  onSubmit() {
    // Reset validation flags
    if (this.createLobbyForm.valid) {
      const title = this.createLobbyForm.get('title')?.value;
      const game = this.createLobbyForm.get('game')?.value;
      const description = this.createLobbyForm.get('description')?.value;
      const lobbySize = this.createLobbyForm.get('lobbySize')?.value;
  
      const storedAccessToken = sessionStorage.getItem('access_token');
  
      if (storedAccessToken) {
        const decodedToken = this.jwtHelper.decodeToken(storedAccessToken);
  
        const userId = decodedToken?.user_id;
  
        if (userId) {
          const lobby = { title, game, description, lobbySize, userId };
  
          this.flaskService.createLobby(lobby).subscribe({
            next: (result: any) => {
              console.log('Lobby created successfully:', result);
              const lobbyId = result.lobby_id;
              this.router.navigate(['/lobby', lobbyId]);
            },
            error: (error: any) => {
              console.log(JSON.stringify(error));
              this.createLobbyError = error?.error?.error || 'An error occurred while creating the lobby.';
              console.error('Create lobby failed:', this.createLobbyError);
            },
          });
        } else {
          console.error('User ID not found in access token');
        }
      } else {
        console.error('Missing access token in sessionStorage');
      }
    }
  }

  //temp
  onGameSelected(event: any): void {
    console.log('Selected game:', this.createLobbyForm.get('game')?.value);
  }

  //temp
  onEnter() {
    const enteredValue = this.createLobbyForm.get('game')?.value;

    const selectedGame = this.gameData.find(game => game.game_name === enteredValue);
    this.onGameSelected({ option: { value: selectedGame } });
  }


}
