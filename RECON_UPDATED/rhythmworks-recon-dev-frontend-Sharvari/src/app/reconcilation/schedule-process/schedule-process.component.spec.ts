import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleProcessComponent } from './schedule-process.component';

describe('ScheduleProcessComponent', () => {
  let component: ScheduleProcessComponent;
  let fixture: ComponentFixture<ScheduleProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
