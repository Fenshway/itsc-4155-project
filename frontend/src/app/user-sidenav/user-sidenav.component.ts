import { Component } from '@angular/core';

@Component({
  selector: 'app-user-sidenav',
  templateUrl: './user-sidenav.component.html',
  styleUrls: ['./user-sidenav.component.css']
})
export class UserSidenavComponent {
  sidebarClosed: boolean = false;
  activeSubMenu: string = '';

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
}
