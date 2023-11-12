import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRoute, Router } from '@angular/router';
import { FlaskdataService } from '../services/flaskdata.service';
import { LibraryPopupComponent } from './components/library-popup/library-popup.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  private libraryPopup: MatDialogRef<LibraryPopupComponent>|undefined;
  session_username:string = "";
  library:any = [];

  data = {
    username: "",
    icon: "../../assets/images/profilepic.png",
    rating: 0,
  }

  constructor(
    private flaskService: FlaskdataService,
    private jwtHelper: JwtHelperService,
    private route: ActivatedRoute,
    private dialog: MatDialog) {
    
    this.data.username = route.snapshot.paramMap.get("username") as string || "";

    const access_token: string|null = sessionStorage.getItem("access_token")
    if(!access_token){return;}
    const user: any = jwtHelper.decodeToken(access_token)
    if(!user){return;}

    this.session_username = user.username;

  }

  ngOnInit() {

    this.route.data.subscribe((profileData: any) => {
      this.data.rating = profileData.data.rating;
      if(profileData.data.icon){
        this.data.icon = "data:;base64," + profileData.data.icon;
      }
    });
    
    this.flaskService.getGames().subscribe((data) => { //for data testing, remove later
      this.library = data;
    })

    this.toggleEditLibrary();

  }

  initProfileIconChange() {

    //Create new file input object
    const fileInput = document.createElement("input")
    fileInput.type = "file";
    fileInput.accept = ".png,.jpg";
    fileInput.multiple = false;
    fileInput.onchange = () => {
      const file = fileInput.files?.item(0);
      if(!file){return;}
      const formData = new FormData();
      formData.set("file", file);
      this.flaskService.updateProfileIcon(formData).subscribe((result: any) => {
        if(!result || !result.icon){return;}
        this.data.icon = "data:;base64," + result.icon;
      })
    }

    //Force open file input object
    fileInput.click();

  }

  isProfileOwner() {
    if(this.session_username == ""){
      return false;
    }
    return this.data.username == this.session_username;
  }

  toggleEditLibrary() {

    if(this.libraryPopup){
      this.libraryPopup.close();
    }else{
      //Open library dialog popup
      this.libraryPopup = this.dialog.open(LibraryPopupComponent, {
        data: {},
        panelClass: "library-popup",
        width: "60%",
      })

      //Listen to dialog close
      this.libraryPopup.afterClosed().subscribe(() => {
        this.libraryPopup = undefined;
      })
    }

  }

}
