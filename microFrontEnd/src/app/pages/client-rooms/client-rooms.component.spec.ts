import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRoomsComponent } from './client-rooms.component';

describe('ClientRoomsComponent', () => {
  let component: ClientRoomsComponent;
  let fixture: ComponentFixture<ClientRoomsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientRoomsComponent]
    });
    fixture = TestBed.createComponent(ClientRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
