import { TestBed } from '@angular/core/testing';

import { ManageSecurityService } from './manage-security.service';

describe('ManageSecurityService', () => {
  let service: ManageSecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageSecurityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
