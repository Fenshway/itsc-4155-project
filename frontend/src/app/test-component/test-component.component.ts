import { Component, OnInit } from '@angular/core';
import { FlaskdataService } from '../services/flaskdata.service';

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.css']
})
export class TestComponentComponent implements OnInit {
  data: any;
  constructor(private flaskService: FlaskdataService) { }

  ngOnInit(): void {
    this.flaskService.getTestData()
      .subscribe((response)=>{
        this.data = response;
        console.log('messgae')
        console.log(response)
      })
  }
}
