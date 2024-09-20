import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelFormacionComponent } from './nivel-formacion.component';

describe('NivelFormacionComponent', () => {
  let component: NivelFormacionComponent;
  let fixture: ComponentFixture<NivelFormacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NivelFormacionComponent]
    });
    fixture = TestBed.createComponent(NivelFormacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
