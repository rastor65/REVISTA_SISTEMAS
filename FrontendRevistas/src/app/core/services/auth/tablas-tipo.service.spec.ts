import { TestBed } from '@angular/core/testing';

import { TablasTipoService } from './tablas-tipo.service';

describe('TablasTipoService', () => {
  let service: TablasTipoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablasTipoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
