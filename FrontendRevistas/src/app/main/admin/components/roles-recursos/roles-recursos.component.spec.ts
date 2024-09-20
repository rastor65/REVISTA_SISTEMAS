import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesRecursosComponent } from './roles-recursos.component';

describe('RolesRecursosComponent', () => {
  let component: RolesRecursosComponent;
  let fixture: ComponentFixture<RolesRecursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesRecursosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesRecursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
