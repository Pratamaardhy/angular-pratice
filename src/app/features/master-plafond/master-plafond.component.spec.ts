import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterPlafondComponent } from './master-plafond.component';

describe('MasterPlafondComponent', () => {
  let component: MasterPlafondComponent;
  let fixture: ComponentFixture<MasterPlafondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterPlafondComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MasterPlafondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
