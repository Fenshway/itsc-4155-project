import { Component } from '@angular/core';

@Component({
  selector: 'app-user-sidenav',
  templateUrl: './user-sidenav.component.html',
  styleUrls: ['./user-sidenav.component.css']
})
export class UserSidenavComponent {
  sidebarClosed: boolean = false;
  activeSubMenu: string = '';

  toggleSubMenu(subMenu: string) {
    this.activeSubMenu = this.activeSubMenu === subMenu ? '' : subMenu;
  }

  toggleSidebar() {
    this.sidebarClosed = !this.sidebarClosed;
  }

  isSubMenuActive(subMenu: string): boolean {
    return this.activeSubMenu === subMenu;
  }
}
