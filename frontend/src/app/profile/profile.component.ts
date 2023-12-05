import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRoute, Router } from '@angular/router';
import { FlaskdataService } from '../services/flaskdata.service';
import { LibraryPopupComponent } from './components/library-popup/library-popup.component';
import { ReportPopupComponent } from './components/report-popup/report-popup.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import ProfileObserver from './profile.observer';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {

  private libraryPopup: MatDialogRef<LibraryPopupComponent>|undefined;
  private reportPopup: MatDialogRef<ReportPopupComponent>|undefined;
  session_username:string = "";
  profileObserver: ProfileObserver|undefined;

  data = {
    user_id: -1,
    username: "",
    icon: "../../assets/images/profilepic.png",
    rating: 0,
    relationship: -1,
    lastVerifiedRelationship: -1,
    status: 0,
    lastVerifiedStatus: 0,
    rateChange: 0,
  }

  constructor(
    private flaskService: FlaskdataService,
    private jwtHelper: JwtHelperService,
    private route: ActivatedRoute,
    private dialog: MatDialog) {

    this.data.username = route.snapshot.paramMap.get("username") as string || "";

    const access_token: string|null = localStorage.getItem("access_token")
    if(!access_token){return;}
    const user: any = jwtHelper.decodeToken(access_token)
    if(!user){return;}

    this.session_username = user.username;

  }

  ngOnInit() {

    this.route.data.subscribe((resolverData: any) => {
      
      const profileData = resolverData.profile;
      const gamesData = resolverData.games;
      
      this.data.rating = profileData.rating;
      this.data.relationship = profileData.relationship;
      this.data.lastVerifiedRelationship = profileData.relationship;
      this.data.user_id = profileData.user_id;
      this.data.status = profileData.status;
      this.data.rateChange = profileData.rateChange;

      if(profileData.icon){
        this.data.icon = "data:;base64," + profileData.icon;
      }

      //ProfileObserver
      this.profileObserver = new ProfileObserver(gamesData, profileData.library);

    }).unsubscribe();

    this.reportUser();

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
    if(this.session_username === ""){
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
        data: {
          profileObserver: this.profileObserver,
        },
        panelClass: "library-popup",
        width: "60%",
      })

      //Listen to dialog close
      this.libraryPopup.afterClosed().subscribe(() => {
        this.libraryPopup = undefined;
      })
    }

  }

  changeFriendStatus(relationshipId: number, overrideId: number = relationshipId) {

    //Updating relationship
    this.data.relationship = overrideId;

    //Sending relationship update request
    const formData:FormData = new FormData();
    formData.set("user_id", this.data.user_id.toString());
    formData.set("relationship", relationshipId.toString());

    let eventSuccess = false;
    
    //Revert update upon event error
    this.flaskService.updateRelationship(formData).subscribe((data: {success?: number}) => {
      eventSuccess = true;
      if(!data.success){
        this.data.relationship = this.data.lastVerifiedRelationship;
      }else{
        this.data.lastVerifiedRelationship = overrideId;
      }

    //Revert update upon backend error (url not reached)
    }).add(() => {
      if(!eventSuccess){
        this.data.relationship = this.data.lastVerifiedRelationship;
      }
    });

  }

  blockUser() {
    
    const overrideId: number = this.data.relationship === 5 ? 7 : 4;
    this.changeFriendStatus(4, overrideId);
    
  }

  unblockUser() {
    
    const overrideId: number = this.data.relationship === 7 ? 5 : 0;
    this.changeFriendStatus(0, overrideId);

  }

  reportUser() {

    if(this.reportPopup){return;}

    //Open library dialog popup
    this.reportPopup = this.dialog.open(ReportPopupComponent, {
      data: {
        username: this.data.username,
      },
      panelClass: "report-popup",
      width: "50%",
    })

    //Listen to dialog close
    this.reportPopup.afterClosed().subscribe(() => {
      this.reportPopup = undefined;
    })

  }

  changeRating(rating: number) {

    //Sending rating update request
    const ratingChange: number = this.data.rateChange === rating ? -rating : (this.data.rateChange !== 0 ? rating * 2 : rating);
    this.data.rateChange += ratingChange;
    this.data.rating += ratingChange;

    const formData:FormData = new FormData();
    formData.set("user_id", this.data.user_id.toString());
    formData.set("vote", this.data.rateChange.toString());

    this.flaskService.updateRating(formData).subscribe((data: {success?: number}) => {
      if(!data.success){
        this.data.rateChange -= ratingChange;
        this.data.rating -= ratingChange;
      }
    });

  }

  changeStatus(event: any) {
    
    const status: number = event.target.value as number;

    //Updating status
    this.data.status = status;

    //Sending status update request
    const formData:FormData = new FormData();
    formData.set("status", status.toString());

    let eventSuccess = false;

    //Revert update upon event error
    this.flaskService.updateStatus(formData).subscribe((data: {success?: number}) => {
      eventSuccess = true;
      if(!data.success){
        this.data.status = this.data.lastVerifiedStatus;
      }else{
        this.data.lastVerifiedStatus = status;
      }

    //Revert update upon backend error (url not reached)
    }).add(() => {
      if(!eventSuccess){
        this.data.status = this.data.lastVerifiedStatus;
      }
    });

  }

}
