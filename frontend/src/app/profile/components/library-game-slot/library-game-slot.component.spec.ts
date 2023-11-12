import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryGameSlotComponent } from './library-game-slot.component';

describe('LibraryGameSlotComponent', () => {
  let component: LibraryGameSlotComponent;
  let fixture: ComponentFixture<LibraryGameSlotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibraryGameSlotComponent]
    });
    fixture = TestBed.createComponent(LibraryGameSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
