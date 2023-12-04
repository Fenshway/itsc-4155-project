import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FlaskdataService } from '../../../services/flaskdata.service';

@Component({
  selector: 'app-report-popup',
  templateUrl: './report-popup.component.html',
  styleUrls: ['./report-popup.component.css']
})
export class ReportPopupComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dialog: MatDialog,
    private flaskService: FlaskdataService) {
  }

}
