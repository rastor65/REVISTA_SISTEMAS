import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerUnaComponent } from './ver-una.component';

describe('VerUnaComponent', () => {
  let component: VerUnaComponent;
  let fixture: ComponentFixture<VerUnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerUnaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerUnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
