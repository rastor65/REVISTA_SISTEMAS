import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevistasComponent } from './revistas.component';

describe('RevistasComponent', () => {
  let component: RevistasComponent;
  let fixture: ComponentFixture<RevistasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevistasComponent]
    });
    fixture = TestBed.createComponent(RevistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
