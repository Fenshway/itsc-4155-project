import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { CreateLobbyComponent } from './create-lobby/create-lobby.component';
import { ProfileComponent } from './profile/profile.component';
import { LobbyComponent } from './lobby/lobby.component';
import { ViewLobbiesComponent } from './view-lobbies/view-lobbies.component';
import { GeneralHomeComponent } from './general-home/general-home.component';
import { isAuthenticatedGuard } from './is-authenticated.guard';

const routes: Routes = [

  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: ViewLobbiesComponent},
  { path: 'register', component: RegistrationComponent},
  { path: 'login', component: LoginComponent},
  { path: 'create-lobby', component: CreateLobbyComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'lobby', component: LobbyComponent, canActivate: [isAuthenticatedGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
