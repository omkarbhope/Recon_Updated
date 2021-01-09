import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineReconciliationProcessComponent } from './define-reconciliation-process.component';

describe('DefineReconciliationProcessComponent', () => {
  let component: DefineReconciliationProcessComponent;
  let fixture: ComponentFixture<DefineReconciliationProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefineReconciliationProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineReconciliationProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
