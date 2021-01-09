import { TestBed } from '@angular/core/testing';

import { CommonSetupService } from './common-setup.service';

describe('CommonSetupService', () => {
  let service: CommonSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
