import { Component, Input, booleanAttribute, numberAttribute } from '@angular/core';
import { FlaskdataService } from 'src/app/services/flaskdata.service';

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

  constructor(
    private flaskService: FlaskdataService,
  ) {}

  ngOnInit() {
    
  }

  addToLibrary() {
    const formData: FormData = new FormData();
    formData.set("gameId", "1");
    formData.set("action", "1");
    this.flaskService.updateLibrary(formData).subscribe(() => {

    });
  }

  removeFromLibrary() {
    const formData: FormData = new FormData();
    formData.set("gameId", "1");
    formData.set("action", "0");
    this.flaskService.updateLibrary(formData).subscribe(() => {
      
    });
  }

}
