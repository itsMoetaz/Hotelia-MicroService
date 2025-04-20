import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueFormComponent } from './historique-form.component';

describe('HistoriqueFormComponent', () => {
  let component: HistoriqueFormComponent;
  let fixture: ComponentFixture<HistoriqueFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriqueFormComponent]
    });
    fixture = TestBed.createComponent(HistoriqueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
