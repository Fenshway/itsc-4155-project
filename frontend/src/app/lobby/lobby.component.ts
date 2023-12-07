import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
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
export class LobbyComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  lobbyData: any;
  lobbyMessages: { username: string, message: string }[] = [];
  messageToSend: string = '';
  username: string = '';
  userColors: { [username: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private flaskService: FlaskdataService,
    private router: Router,
    private lobbyChatService: LobbyChatService,
    private userService: UserServiceService,
    private jwtHelper: JwtHelperService
  ) {}

  ngOnInit(): void {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      const decodedToken = this.jwtHelper.decodeToken(accessToken);
      this.username = decodedToken?.username;
    }

    this.route.params.subscribe(params => {
      const lobbyId = +params['id'];
      const requestedLobby = { requestedLobby: lobbyId };

      this.flaskService.getLobbyById(requestedLobby).subscribe({
        next: (data: any) => {
          this.lobbyData = data;

          this.lobbyChatService.receiveMessages().subscribe(chatMessage => {
            this.setUserColor(chatMessage.username);
            this.lobbyMessages.push({ username: chatMessage.username, message: chatMessage.message });
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

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }

  sendMessage(): void {
    this.lobbyChatService.sendMessage(this.lobbyData.lobby.lobby_id, this.username, this.messageToSend);
    this.messageToSend = '';
  }

  private setUserColor(username: string): void {
    if (!this.userColors[username]) {
      this.userColors[username] = this.getRandomColor();
    }
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  leaveLobby(): void {
    this.route.params.subscribe(params => {
      const lobbyId = +params['id'];
      const lobbyToLeave = { lobbyToLeave: lobbyId };
      this.flaskService.leaveLobby(lobbyToLeave).subscribe({
        next: (result: any)=>{
          this.userService.clearInLobby();
          this.router.navigate([`directory`]);
        },
        error: (error: any)=>{
          console.log(JSON.stringify(error));
        }
      });
    });
  }
}