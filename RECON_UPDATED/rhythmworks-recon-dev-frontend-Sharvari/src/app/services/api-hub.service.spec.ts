import { TestBed } from '@angular/core/testing';

import { ApiHubService } from './api-hub.service';

describe('ApiHubService', () => {
  let service: ApiHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
