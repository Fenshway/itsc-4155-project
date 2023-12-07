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
import { HelpCenterComponent } from './help-center/help-center.component';
import ProfileResolver from './profile/profile.resolver'
import GamesResolver from './profile/games.resolver'


const routes: Routes = [
  { path: '', redirectTo: '/directory', pathMatch: 'full'},
  { path: 'directory', component: ViewLobbiesComponent, canActivate: [isAuthenticatedGuard]},
  { path: 'register', component: RegistrationComponent},
  { path: 'login', component: LoginComponent},
  { path: 'create-lobby', component: CreateLobbyComponent, canActivate: [isAuthenticatedGuard]},
  { path: 'help', component: HelpCenterComponent, canActivate: [isAuthenticatedGuard]},
  { path: 'lobby/:id', component: LobbyComponent, canActivate: [isAuthenticatedGuard]},
  { path: 'directory/:gameName', component: GameLobbiesComponent, canActivate: [isAuthenticatedGuard]},
  { path: 'profile/:username', component: ProfileComponent, resolve: {profile: ProfileResolver, games: GamesResolver}, canActivate: [isAuthenticatedGuard], runGuardsAndResolvers: 'always'},
  { path: 'welcome', component: GeneralHomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
