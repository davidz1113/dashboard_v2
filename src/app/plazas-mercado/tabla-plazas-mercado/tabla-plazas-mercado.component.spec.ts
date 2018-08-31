import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaPlazasMercadoComponent } from './tabla-plazas-mercado.component';

describe('TablaPlazasMercadoComponent', () => {
  let component: TablaPlazasMercadoComponent;
  let fixture: ComponentFixture<TablaPlazasMercadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaPlazasMercadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaPlazasMercadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
