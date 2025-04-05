import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListComponent } from './service-list.component';

describe('ItemListComponent', () => {
  let component: ItemListComponent;
  let fixture: ComponentFixture<ItemListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemListComponent]
    });
    fixture = TestBed.createComponent(ItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
