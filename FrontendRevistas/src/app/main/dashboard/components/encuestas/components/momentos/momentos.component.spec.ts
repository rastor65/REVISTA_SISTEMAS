import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MomentosComponent } from './momentos.component';

describe('MomentosComponent', () => {
  let component: MomentosComponent;
  let fixture: ComponentFixture<MomentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MomentosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MomentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
