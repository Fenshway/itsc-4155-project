import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LobbyChatService {
  private socket: Socket = io('http://localhost:5000');

  constructor() { }

  sendMessage(lobbyId: any, username: string, message: string): void {
    this.socket.emit('message', { lobby: lobbyId, username, message });
  }

  receiveMessages(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
  }

  joinLobby(lobbyId: any, username: string): void {
    this.socket.emit('join', { lobby: lobbyId, username });
  }

  receiveJoinNotifications(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('message', (data) => {
        if (data.username === 'system' && data.message.startsWith('has joined')) {
          observer.next(data);
        }
      });
    });
  }

}
