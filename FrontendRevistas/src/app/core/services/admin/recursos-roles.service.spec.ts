import { TestBed } from '@angular/core/testing';

import { RecursosRolesService } from './recursos-roles.service';

describe('RecursosRolesService', () => {
  let service: RecursosRolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecursosRolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
