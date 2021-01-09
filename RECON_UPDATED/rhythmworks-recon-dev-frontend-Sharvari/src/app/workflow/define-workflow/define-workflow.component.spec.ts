import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineWorkflowComponent } from './define-workflow.component';

describe('DefineWorkflowComponent', () => {
  let component: DefineWorkflowComponent;
  let fixture: ComponentFixture<DefineWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefineWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


