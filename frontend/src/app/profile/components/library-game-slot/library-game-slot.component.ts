import { Component, Input, booleanAttribute, numberAttribute } from '@angular/core';
import { FlaskdataService } from 'src/app/services/flaskdata.service';
import ProfileObserver from '../../profile.observer';

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
  
  public action: number = -1;
  private lastVerifiedAction: number = -1;

  @Input() public profileObserver: ProfileObserver|undefined;
  @Input({ transform: numberAttribute }) public gameId: number = -1;
  @Input() public gameName: string = "";
  @Input() public gameImg: string = "";
  @Input() public set type(value: string) {
    switch(value) {
      case "adding":
        this.action = this.lastVerifiedAction = 1;
        break;
      case "removing":
        this.action = this.lastVerifiedAction = 0;
        break;
    }
  };
  @Input({ transform: booleanAttribute }) public isProfileOwner: boolean = false;
  @Input({ transform: booleanAttribute }) public enableEditing: boolean = false;

  constructor(
    private flaskService: FlaskdataService,
  ) {}

  ngOnInit() {}

  updateLibrary() {

    const formData: FormData = new FormData();
    const gameId: number = this.gameId;
    const action: number = this.action;
    formData.set("gameId", gameId.toString());
    formData.set("action", action.toString());
    this.profileObserver?.updateLibrary({GameId: this.gameId, Action: this.action});

    let eventSuccess = false;
    
    //Revert update upon event error
    this.flaskService.updateLibrary(formData).subscribe((data: {success?: number}) => {
      eventSuccess = true;
      if(!data.success){
        this.profileObserver?.updateLibrary({GameId: gameId, Action: (action === 1 ? 0 : 1)});
      }

    //Revert update upon backend error (url not reached)
    }).add(() => {
      if(!eventSuccess) {
        this.action = this.lastVerifiedAction;
        this.profileObserver?.updateLibrary({GameId: gameId, Action: (action === 1 ? 0 : 1)});
      }else{
        this.lastVerifiedAction = action;
      }
    });

  }

}
