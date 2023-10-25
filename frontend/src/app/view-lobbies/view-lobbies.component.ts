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

  gamesLibrary() {

  }
  ngOnInit(): void {
    this.loadGameLibrary();
  }

  loadGameLibrary() {
    this.http.get('https://www.freetogame.com/api/games?platform=pc')
    .subscribe((data) => {
      this.gamesData = data;
    });
  }
}
