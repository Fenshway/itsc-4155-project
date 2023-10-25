import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLobbiesComponent } from './view-lobbies.component';

describe('ViewLobbiesComponent', () => {
  let component: ViewLobbiesComponent;
  let fixture: ComponentFixture<ViewLobbiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewLobbiesComponent]
    });
    fixture = TestBed.createComponent(ViewLobbiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
