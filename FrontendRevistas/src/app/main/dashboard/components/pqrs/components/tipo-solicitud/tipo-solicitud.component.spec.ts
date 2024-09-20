import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoSolicitudComponent } from './tipo-solicitud.component';

describe('TipoSolicitudComponent', () => {
  let component: TipoSolicitudComponent;
  let fixture: ComponentFixture<TipoSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoSolicitudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
