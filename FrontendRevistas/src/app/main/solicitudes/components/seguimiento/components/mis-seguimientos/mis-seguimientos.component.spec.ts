import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisSeguimientosComponent } from './mis-seguimientos.component';

describe('MisSeguimientosComponent', () => {
  let component: MisSeguimientosComponent;
  let fixture: ComponentFixture<MisSeguimientosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MisSeguimientosComponent]
    });
    fixture = TestBed.createComponent(MisSeguimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
