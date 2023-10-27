import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-lobbies',
  templateUrl: './view-lobbies.component.html',
  styleUrls: ['./view-lobbies.component.css']
})
export class ViewLobbiesComponent {
  gamesData: any;
  errorMessage: any;

  constructor(private http: HttpClient) {}

}
