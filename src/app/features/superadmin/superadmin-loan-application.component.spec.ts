import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperadminLoanApplicationComponent } from './superadmin-loan-application.component';

describe('SuperadminLoanApplicationComponent', () => {
  let component: SuperadminLoanApplicationComponent;
  let fixture: ComponentFixture<SuperadminLoanApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperadminLoanApplicationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperadminLoanApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
