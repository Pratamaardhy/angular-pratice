import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PenggunaService } from './pengguna.services';

describe('PenggunaService', () => {
  let component: PenggunaService;
  let fixture: ComponentFixture<PenggunaService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenggunaService],
    }).compileComponents();

    fixture = TestBed.createComponent(PenggunaService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
