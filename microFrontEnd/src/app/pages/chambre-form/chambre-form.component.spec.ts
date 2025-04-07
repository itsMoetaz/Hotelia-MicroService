import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChambreFormComponent } from './chambre-form.component';

describe('ChambreFormComponent', () => {
  let component: ChambreFormComponent;
  let fixture: ComponentFixture<ChambreFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChambreFormComponent]
    });
    fixture = TestBed.createComponent(ChambreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
