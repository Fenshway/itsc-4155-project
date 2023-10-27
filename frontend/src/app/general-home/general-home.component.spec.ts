import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralHomeComponent } from './general-home.component';

describe('GeneralHomeComponent', () => {
  let component: GeneralHomeComponent;
  let fixture: ComponentFixture<GeneralHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralHomeComponent]
    });
    fixture = TestBed.createComponent(GeneralHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
