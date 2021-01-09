import { TestBed } from '@angular/core/testing';

import { ReconcilationService } from './reconcilation.service';

describe('ReconcilationService', () => {
  let service: ReconcilationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReconcilationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
