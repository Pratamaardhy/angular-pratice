import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BmApprovalComponent } from './bm-approval.component';

describe('BmApprovalComponent', () => {
  let component: BmApprovalComponent;
  let fixture: ComponentFixture<BmApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BmApprovalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BmApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
