import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineReconcilationComponent } from './define-reconcilation.component';

describe('DefineReconcilationComponent', () => {
  let component: DefineReconcilationComponent;
  let fixture: ComponentFixture<DefineReconcilationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefineReconcilationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineReconcilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
