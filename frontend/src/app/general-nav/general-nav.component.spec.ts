import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralNavComponent } from './general-nav.component';

describe('GeneralNavComponent', () => {
  let component: GeneralNavComponent;
  let fixture: ComponentFixture<GeneralNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralNavComponent]
    });
    fixture = TestBed.createComponent(GeneralNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
