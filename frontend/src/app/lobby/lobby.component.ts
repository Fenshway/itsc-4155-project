import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlaskdataService } from '../services/flaskdata.service';
import { LobbyChatService } from '../services/lobby-chat.service';
import { UserServiceService } from '../services/user-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent {
  lobbyData: any;
  lobbyMessages: { username: string, message: string }[] = [];
  messageToSend: string = '';
  username: string = '';

  constructor(
    private route: ActivatedRoute,
    private flaskService: FlaskdataService,
    private router: Router,
    private lobbyChatService: LobbyChatService,
    private userService: UserServiceService,
    private jwtHelper: JwtHelperService
  ) {}

  ngOnInit(): void {
    // Bad code but works for now
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      const decodedToken = this.jwtHelper.decodeToken(accessToken);
      this.username = decodedToken?.username;
    }
    //
    this.route.params.subscribe(params => {
      const lobbyId = +params['id'];
      const requestedLobby = { requestedLobby: lobbyId };

      this.flaskService.getLobbyById(requestedLobby).subscribe({
        next: (data: any) => {
          this.lobbyData = data;
          console.log(this.lobbyData)

          this.lobbyChatService.receiveMessages().subscribe(chatMessage => {
            this.lobbyMessages.push({ username: chatMessage.username, message: chatMessage.message});
            console.log('Chat Message', chatMessage);
          });

          this.lobbyChatService.joinLobby(this.lobbyData.lobby.lobby_id, this.username);

          this.lobbyChatService.receiveJoinNotifications().subscribe(joinNotification => {
            console.log(`${joinNotification.username} has joined the lobby.`);
          });

        },
        error: (error: any) => {
          console.error('Failed to load lobby data:', error);
          this.router.navigate(['/directory']);
        }
      });
    });
  }

  sendMessage(): void {
    this.lobbyChatService.sendMessage(this.lobbyData.lobby.lobby_id, this.username, this.messageToSend)
    this.messageToSend = '';
  }

  leaveLobby(): void {
    this.route.params.subscribe(params => {
      const lobbyId = +params['id'];
      const lobbyToLeave = { lobbyToLeave: lobbyId };
      this.flaskService.leaveLobby(lobbyToLeave).subscribe({
        next: (result: any)=>{
          this.router.navigate([`directory`]);
        },
        error: (error: any)=>{
          console.log(JSON.stringify(error))
        }
      });
    });
  }
}
