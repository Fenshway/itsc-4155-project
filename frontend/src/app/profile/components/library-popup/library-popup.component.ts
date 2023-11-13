import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FlaskdataService } from '../../../services/flaskdata.service';
import profileObserver from '../../profile.observer';

@Component({
  selector: 'app-library-popup',
  templateUrl: './library-popup.component.html',
  styleUrls: ['./library-popup.component.css']
})
export class LibraryPopupComponent {

  profileObserver: profileObserver;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dialog: MatDialog,
    private flaskService: FlaskdataService) {

    this.profileObserver = data.profileObserver;

  }

  ngOnInit() {}

  close() {
    this.dialog.closeAll();
  }

}
