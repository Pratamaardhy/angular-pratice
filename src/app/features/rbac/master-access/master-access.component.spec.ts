import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterAccessComponent } from './master-access.component';

describe('MasterAccessComponent', () => {
  let component: MasterAccessComponent;
  let fixture: ComponentFixture<MasterAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterAccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MasterAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
