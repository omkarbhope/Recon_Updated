import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeResolutionComponent } from './dispute-resolution.component';

describe('DisputeResolutionComponent', () => {
  let component: DisputeResolutionComponent;
  let fixture: ComponentFixture<DisputeResolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisputeResolutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisputeResolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
