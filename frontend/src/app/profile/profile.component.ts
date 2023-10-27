import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { FlaskdataService } from '../services/flaskdata.service';

type user_data = {
  username: string,
  icon: string,
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  data = {
    username: "",
    icon: "../../assets/images/profilepic.png",
  }

  constructor(private flaskService: FlaskdataService, private jwtHelper: JwtHelperService, private router: Router) {
    
    //Load user information
    const access_token: string|null = localStorage.getItem("access_token")
    if(!access_token){return;}
    const user: user_data|null = jwtHelper.decodeToken(access_token)
    if(!user){return;}
    console.log(user)
    //Update user info fields
    this.data.username = user.username;
    if(user.icon){
      this.data.icon = "data:;base64," + user.icon;
    }

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

}
