import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { CreateLobbyComponent } from './create-lobby/create-lobby.component';
import { ProfileComponent } from './profile/profile.component';
import { LobbyComponent } from './lobby/lobby.component';
import { ViewLobbiesComponent } from './view-lobbies/view-lobbies.component';
import { GeneralHomeComponent } from './general-home/general-home.component';
import { GameLobbiesComponent } from './game-lobbies/game-lobbies.component';
import { isAuthenticatedGuard } from './is-authenticated.guard';
import ProfileResolver from './profile/profile.resolver'
import GamesResolver from './profile/games.resolver'

const routes: Routes = [
  { path: '', redirectTo: '/directory', pathMatch: 'full'},
  { path: 'directory', component: ViewLobbiesComponent},
  { path: 'register', component: RegistrationComponent},
  { path: 'login', component: LoginComponent},
  { path: 'create-lobby', component: CreateLobbyComponent},
  { path: 'lobby/:id', component: LobbyComponent},
  { path: 'directory/:gameName', component: GameLobbiesComponent},
  { path: 'profile/:username', component: ProfileComponent, resolve: {profile: ProfileResolver, games: GamesResolver}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
