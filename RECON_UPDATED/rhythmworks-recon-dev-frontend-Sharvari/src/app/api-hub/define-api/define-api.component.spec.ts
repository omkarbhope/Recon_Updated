import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineApiComponent } from './define-api.component';

describe('DefineApiComponent', () => {
  let component: DefineApiComponent;
  let fixture: ComponentFixture<DefineApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefineApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
