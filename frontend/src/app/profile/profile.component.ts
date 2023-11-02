import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRoute, Router } from '@angular/router';
import { FlaskdataService } from '../services/flaskdata.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  data = {
    username: "",
    icon: "../../assets/images/profilepic.png",
    rating: 0,
  }

  constructor(private flaskService: FlaskdataService, private jwtHelper: JwtHelperService, private router: Router, private route: ActivatedRoute) {
    
    /*Load user information
    const access_token: string|null = sessionStorage.getItem("access_token")
    if(!access_token){return;}
    const user: any = jwtHelper.decodeToken(access_token)
    if(!user){return;}
    
    //Update user info fields
    this.data.username = user.username;
    */

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
      this.flaskService.updateProfilePicture(formData).subscribe((result: any) => {
        if(!result || !result.icon){return;}
        this.data.icon = "data:;base64," + result.icon;
      })
    }

    //Force open file input object
    fileInput.click();

  }

  ngOnInit() {

    this.route.data.subscribe((profileData: any) => {
      this.data.username = profileData.data.username;
      this.data.rating = profileData.data.rating;
      if(profileData.data.icon){
        this.data.icon = "data:;base64," + profileData.data.icon;
      }
    });
    
  }

}
