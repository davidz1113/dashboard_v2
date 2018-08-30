import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlazaMercadoComponent } from './plaza-mercado.component';

describe('PlazaMercadoComponent', () => {
  let component: PlazaMercadoComponent;
  let fixture: ComponentFixture<PlazaMercadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlazaMercadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlazaMercadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
