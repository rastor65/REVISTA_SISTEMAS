import { TestBed } from '@angular/core/testing';

import { ClasificadosService } from './clasificados.service';

describe('ClasificadosService', () => {
  let service: ClasificadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClasificadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
