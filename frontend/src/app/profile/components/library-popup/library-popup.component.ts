import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FlaskdataService } from '../../../services/flaskdata.service';

@Component({
  selector: 'app-library-popup',
  templateUrl: './library-popup.component.html',
  styleUrls: ['./library-popup.component.css']
})
export class LibraryPopupComponent {

  library: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dialog: MatDialog,
    private flaskService: FlaskdataService) {}

  ngOnInit() {

    this.flaskService.getGames().subscribe((data) => {
      this.library = data;
    })

  }

  close() {
    this.dialog.closeAll();
  }

}
