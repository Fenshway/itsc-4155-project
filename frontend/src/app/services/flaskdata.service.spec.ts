import { TestBed } from '@angular/core/testing';

import { FlaskdataService } from './flaskdata.service';

describe('FlaskdataService', () => {
  let service: FlaskdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlaskdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
