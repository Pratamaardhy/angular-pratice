import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthStore } from './auth.store';

describe('AuthStore', () => {
  let component: AuthStore;
  let fixture: ComponentFixture<AuthStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthStore],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthStore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
