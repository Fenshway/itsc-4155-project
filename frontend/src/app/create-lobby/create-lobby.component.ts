import { Component } from '@angular/core';
import { FlaskdataService } from '../services/flaskdata.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

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
    ])
  });

  createLobbyError?: string;
  jwtHelper: any;

  constructor(
    private flaskService: FlaskdataService,
    private router: Router,
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
      const userId = this.jwtHelper.decodeToken(storedAccessToken).user_id;

      const lobby = { title, game, description, lobbySize, userId }

      this.flaskService.createLobby(lobby).subscribe({
        next: (result: any) => {
          console.log('Lobby created successfully:', result);
          this.router.navigate(['/lobby']);

        },
        error: (error: any) => {
          console.log(JSON.stringify(error))
          this.createLobbyError = error.error.error;
          console.error('Create lobby failed')
        }
      });

    }
  }

  onGameSelected(event: any): void {
    console.log('Selected game:', this.createLobbyForm.get('game')?.value);
  }

  onEnter() {
    // You can access the current value of the input field and find the corresponding game in gameData
    const enteredValue = this.createLobbyForm.get('game')?.value;

    const selectedGame = this.gameData.find(game => game.game_name === enteredValue);

    // Perform any additional logic with the selected game if needed

    // Call the existing onGameSelected method with the selected event
    this.onGameSelected({ option: { value: selectedGame } });
  }


}
