import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponentComponent } from './test-component/test-component.component';
import { UserNavComponent } from './user-nav/user-nav.component';
import { GeneralNavComponent } from './general-nav/general-nav.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { CreateLobbyComponent } from './create-lobby/create-lobby.component';
import { FormsModule } from '@angular/forms';
import { UserSidenavComponent } from './user-sidenav/user-sidenav.component';
import { JwtModule } from '@auth0/angular-jwt';
import { ProfileComponent } from './profile/profile.component';
import { LobbyComponent } from './lobby/lobby.component';
import { ViewLobbiesComponent } from './view-lobbies/view-lobbies.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    TestComponentComponent,
    UserNavComponent,
    GeneralNavComponent,
    RegistrationComponent,
    LoginComponent,
    CreateLobbyComponent,
    UserSidenavComponent,
    ProfileComponent,
    LobbyComponent,
    ViewLobbiesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
