import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RbacService } from './rbac.service';

describe('RbacService', () => {
  let component: RbacService;
  let fixture: ComponentFixture<RbacService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RbacService],
    }).compileComponents();

    fixture = TestBed.createComponent(RbacService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
