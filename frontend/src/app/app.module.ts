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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserSidenavComponent } from './user-sidenav/user-sidenav.component';
import { JwtModule } from '@auth0/angular-jwt';
import { ProfileComponent } from './profile/profile.component';
import { LobbyComponent } from './lobby/lobby.component';
import { ViewLobbiesComponent } from './view-lobbies/view-lobbies.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GeneralHomeComponent } from './general-home/general-home.component';
import { GameLobbiesComponent } from './game-lobbies/game-lobbies.component';
import { LibraryPopupComponent } from './profile/components/library-popup/library-popup.component';
import { LibraryGameSlotComponent } from './profile/components/library-game-slot/library-game-slot.component';
import { HelpCenterComponent } from './help-center/help-center.component';
import { ReportPopupComponent } from './profile/components/report-popup/report-popup.component';

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
    ViewLobbiesComponent,
    GeneralHomeComponent,
    LibraryPopupComponent,
    LibraryGameSlotComponent,
    GameLobbiesComponent,
    HelpCenterComponent
    ReportPopupComponent
  ],
  imports: [
    MatSelectModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    }),
    BrowserAnimationsModule,

  ],
  providers: [],
  bootstrap: [AppComponent], 
  exports: [
    MatSelectModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule
  ], 
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
