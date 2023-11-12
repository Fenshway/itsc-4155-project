import { Component, Input, booleanAttribute, numberAttribute } from '@angular/core';

type gameData = [{
  "game_id": number,
  "game_name": string,
  "img_path": string,
}]

@Component({
  selector: 'app-library-game-slot',
  templateUrl: './library-game-slot.component.html',
  styleUrls: ['./library-game-slot.component.css'],
})
export class LibraryGameSlotComponent {

  @Input({ transform: numberAttribute }) public gameId: number = -1;
  @Input() public gameName: string = "";
  @Input() public gameImg: string = "";
  @Input() public type: string = "";
  @Input({ transform: booleanAttribute }) public isProfileOwner: boolean = false;
  @Input({ transform: booleanAttribute }) public enableEditing: boolean = false;

  constructor() {}

  ngOnInit() {
    
  }

}
