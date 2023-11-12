import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryPopupComponent } from './library-popup.component';

describe('LibraryPopupComponent', () => {
  let component: LibraryPopupComponent;
  let fixture: ComponentFixture<LibraryPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibraryPopupComponent]
    });
    fixture = TestBed.createComponent(LibraryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
