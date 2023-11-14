import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-user-sidenav',
  templateUrl: './user-sidenav.component.html',
  styleUrls: ['./user-sidenav.component.css']
})
export class UserSidenavComponent {
  sidebarClosed: boolean = false;
  activeSubMenu: string = '';

  constructor(
    private userService: UserServiceService,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  toggleSubMenu(subMenu: string, event: Event) {
    event.stopPropagation();
    console.log('closing', subMenu)
    if (this.activeSubMenu === subMenu) {
      this.activeSubMenu = '';
    } else {
      this.activeSubMenu = subMenu;
      console.log('opening', subMenu);
    }
  }

  isSubMenuActive(subMenu: string): boolean {
    return this.activeSubMenu === subMenu;
  }

  toggleSidebar() {
    this.sidebarClosed = !this.sidebarClosed;
  }

  // logout() {
  //   console.log('Click')
  //   this.userService.clearUser();
  //   localStorage.removeItem('access_token');
  //   console.log('Logout succesful')
  //   this.router.navigate(['/login']);
  // }
}
