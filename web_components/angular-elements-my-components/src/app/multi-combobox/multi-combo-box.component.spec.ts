import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiComboBoxComponent } from './multi-combo-box.component';

describe('ButtonComponent', () => {
  let component: MultiComboBoxComponent;
  let fixture: ComponentFixture<MultiComboBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiComboBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiComboBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
