import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesAsignadasComponent } from './solicitudes-asignadas.component';

describe('SolicitudesAsignadasComponent', () => {
  let component: SolicitudesAsignadasComponent;
  let fixture: ComponentFixture<SolicitudesAsignadasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudesAsignadasComponent]
    });
    fixture = TestBed.createComponent(SolicitudesAsignadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
