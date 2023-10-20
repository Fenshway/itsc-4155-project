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

@NgModule({
  declarations: [
    AppComponent,
    TestComponentComponent,
    UserNavComponent,
    GeneralNavComponent,
    RegistrationComponent,
    LoginComponent,
    CreateLobbyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
