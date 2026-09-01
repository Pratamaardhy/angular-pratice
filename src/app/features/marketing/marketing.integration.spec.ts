import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MarketingQueueComponent } from './marketing.component';

describe('MarketingQueueComponent (Integration Test)', () => {
  let fixture: ComponentFixture<MarketingQueueComponent>;
  let component: MarketingQueueComponent;
  let httpTesting: HttpTestingController;

  const getNativeElement = () => fixture.nativeElement as HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MarketingQueueComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    fixture = TestBed.createComponent(MarketingQueueComponent);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.verify(); // Memastikan tidak ada request tertinggal
    fixture.destroy();
  });

  // POSITIVE TEST CASE
  it('harus menyaring daftar pengajuan berdasarkan kata kunci pencarian dan memperbarui tabel DOM', () => {
    // Arrange: Set pencarian ke nama 'Budi'
    const searchInput = getNativeElement().querySelector<HTMLInputElement>('input[type="text"]')!;

    // Act
    searchInput.value = 'Budi';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Assert: Tabel hanya menampilkan 1 baris Budi Santoso
    const rows = getNativeElement().querySelectorAll('tbody tr');
    expect(component.filteredQueue().length).toBe(1);
    expect(rows.length).toBe(1);
    expect(getNativeElement().textContent).toContain('Budi Santoso');
    expect(getNativeElement().textContent).not.toContain('Rina Indah');
  });

  // NEGATIVE TEST CASE
  it('harus menolak submit modal review jika catatan review kosong/invalid dan menampilkan pesan error', () => {
    // Arrange: Buka modal aksi Approve untuk item pertama
    const targetItem = component.queueItems()[0];
    component.openActionModal(targetItem, 'APPROVE');
    fixture.detectChanges();

    // Act: Kosongkan form catatan lalu jalankan submit
    component.reviewForm.controls.notes.setValue('');
    component.submitReview();
    fixture.detectChanges();

    // Assert: State isSubmitting tetap false dan elemen pesan error muncul di modal DOM
    expect(component.isSubmitting()).toBe(false);
    expect(component.reviewForm.invalid).toBe(true);

    const errorMessageEl = getNativeElement().querySelector('.text-red-600');
    expect(errorMessageEl).not.toBeNull();
    expect(errorMessageEl?.textContent).toContain('Catatan wajib diisi minimal 5 karakter');
  });
});
