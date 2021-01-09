import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineStandardApiDefinitionComponent } from './define-standard-api-definition.component';

describe('DefineStandardApiDefinitionComponent', () => {
  let component: DefineStandardApiDefinitionComponent;
  let fixture: ComponentFixture<DefineStandardApiDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefineStandardApiDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineStandardApiDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
