import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlaskdataService } from '../services/flaskdata.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent {
  lobbyData: any;

  constructor(
    private route: ActivatedRoute,
    private flaskService: FlaskdataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const lobbyId = +params['id'];
      const requestedLobby = { requestedLobby: lobbyId };

      this.flaskService.getLobbyById(requestedLobby).subscribe({
        next: (data: any) => {
          this.lobbyData = data;
          console.log(this.lobbyData)
        },
        error: (error: any) => {
          console.error('Failed to load lobby data:', error);
          this.router.navigate(['/home']);
        }
      });
    });
  }
}
