import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentItem, LoanApplicationItem } from '../../core/models/loan-application.model';

@Component({
  selector: 'app-marketing-queue',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingQueueComponent {
  readonly currentBranch = signal('JAKARTA');
  readonly searchQuery = signal('');
  readonly selectedStatusFilter = signal<string>('ALL');

  readonly isActionModalOpen = signal(false);
  readonly selectedItem = signal<LoanApplicationItem | null>(null);
  readonly currentAction = signal<'APPROVE' | 'REJECT' | 'REQUEST_ADDITIONAL_DATA' | null>(null);
  readonly isSubmitting = signal(false);

  readonly isDetailModalOpen = signal(false);
  readonly previewDocument = signal<DocumentItem | null>(null);

  readonly reviewForm;

  // Dummy Data Terdeksinya Wilayah JAKARTA
  readonly queueItems = signal<LoanApplicationItem[]>([
    {
      id: 101,
      loanApplicationNo: 'APP-JKT-2026-001',
      branchCode: 'JAKARTA',
      branchName: 'Cabang Jakarta Selatan',
      customerName: 'Budi Santoso',
      customerNik: '3271012304920001',
      occupation: 'Karyawan Swasta (BCA Finance)',
      monthlyIncome: 15000000,
      bankName: 'BCA',
      accountNumber: '1234567890',
      accountHolderName: 'Budi Santoso',
      productName: 'Pinjaman Multiguna',
      tenorMonths: 24,
      tierOptions: [
        { tierLevel: 1, amount: 50000000 },
        { tierLevel: 2, amount: 100000000 },
        { tierLevel: 3, amount: 150000000 },
      ],
      requestedTierLevel: 3,
      requestedAmount: 150000000,
      statusCode: 'SUBMITTED',
      statusName: 'SUBMITTED',
      createdAt: '2026-09-01 09:00',
      documents: [
        {
          id: 1,
          documentType: 'KTP',
          documentName: 'KTP_Budi.jpg',
          documentUrl: 'https://placehold.co/600x400/00236f/ffffff?text=KTP+Budi+Santoso',
          uploadedAt: '2026-09-01 08:50',
        },
      ],
    },
  ]);

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.nonNullable.group({
      notes: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  readonly filteredQueue = computed(() => {
    const search = this.searchQuery().toLowerCase();
    const filter = this.selectedStatusFilter();

    return this.queueItems().filter((item) => {
      const matchesBranch = item.branchCode === this.currentBranch();
      const matchesSearch =
        item.loanApplicationNo.toLowerCase().includes(search) ||
        item.customerName.toLowerCase().includes(search) ||
        item.customerNik.includes(search);
      const matchesStatus = filter === 'ALL' || item.statusCode === filter;

      return matchesBranch && matchesSearch && matchesStatus;
    });
  });

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  openDetailModal(item: LoanApplicationItem): void {
    this.selectedItem.set(item);
    this.previewDocument.set(item.documents[0] ?? null);
    this.isDetailModalOpen.set(true);
  }

  closeDetailModal(): void {
    this.isDetailModalOpen.set(false);
    this.selectedItem.set(null);
  }

  setPreviewDocument(doc: DocumentItem): void {
    this.previewDocument.set(doc);
  }

  openActionModal(
    item: LoanApplicationItem,
    action: 'APPROVE' | 'REJECT' | 'REQUEST_ADDITIONAL_DATA',
  ): void {
    this.selectedItem.set(item);
    this.currentAction.set(action);
    this.reviewForm.reset();
    this.isActionModalOpen.set(true);
  }

  closeActionModal(): void {
    this.isActionModalOpen.set(false);
    this.selectedItem.set(null);
    this.currentAction.set(null);
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const item = this.selectedItem();
    if (!item) return;

    this.isSubmitting.set(true);
    setTimeout(() => {
      this.queueItems.update((items) => items.filter((target) => target.id !== item.id));
      this.isSubmitting.set(false);
      this.closeActionModal();
    }, 500);
  }
}
