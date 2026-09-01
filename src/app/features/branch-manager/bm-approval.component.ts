import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentItem, MarketingLoanItem } from '../../core/models/marketing.model';

export type BmActionType = 'APPROVE' | 'REJECT';

export interface BmLoanItem extends MarketingLoanItem {
  marketingNotes: string;
  marketingReviewerName: string;
}

@Component({
  selector: 'app-bm-approval',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './bm-approval.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BmApprovalComponent {
  readonly searchQuery = signal('');

  readonly isActionModalOpen = signal(false);
  readonly selectedItem = signal<BmLoanItem | null>(null);
  readonly currentAction = signal<BmActionType | null>(null);
  readonly isSubmitting = signal(false);

  readonly isDetailModalOpen = signal(false);
  readonly previewDocument = signal<DocumentItem | null>(null);

  readonly approvalForm;

  readonly queueItems = signal<BmLoanItem[]>([
    {
      id: 301,
      loanApplicationNo: 'APP-202608-002',
      customerName: 'Siti Rahma',
      customerNik: '3271015508940003',
      birthPlace: 'Bandung',
      birthDate: '1991-03-18',
      gender: 'P',
      maritalStatus: 'Belum Menikah',
      occupation: 'Pemilik Usaha Restoran',
      monthlyIncome: 35000000,
      bankName: 'Mandiri',
      accountNumber: '9876543210',
      accountHolderName: 'Siti Rahma',
      productName: 'Modal Usaha',
      amount: 150000000,
      tenorMonths: 36,
      statusCode: 'SUBMITTED',
      statusName: 'REVIEWED (MARKETING)',
      createdAt: '2026-08-29 10:15',
      marketingNotes: 'Dokumen lengkap, usaha berjalan 3 tahun, kelayakan finansial sangat baik.',
      marketingReviewerName: 'Budi (Marketing)',
      documents: [
        {
          id: 10,
          documentType: 'KTP',
          documentName: 'KTP_Siti_Rahma.jpg',
          documentUrl: 'https://placehold.co/600x400/00236f/ffffff?text=KTP+Siti+Rahma',
          uploadedAt: '2026-08-29 10:00',
        },
      ],
    },
  ]);

  constructor(private fb: FormBuilder) {
    this.approvalForm = this.fb.nonNullable.group({
      notes: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  readonly filteredQueue = computed(() => {
    const search = this.searchQuery().toLowerCase();
    return this.queueItems().filter(
      (item) =>
        item.loanApplicationNo.toLowerCase().includes(search) ||
        item.customerName.toLowerCase().includes(search) ||
        item.customerNik.includes(search),
    );
  });

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  openDetailModal(item: BmLoanItem): void {
    this.selectedItem.set(item);
    this.previewDocument.set(item.documents[0] ?? null);
    this.isDetailModalOpen.set(true);
  }

  closeDetailModal(): void {
    this.isDetailModalOpen.set(false);
    this.selectedItem.set(null);
    this.previewDocument.set(null);
  }

  setPreviewDocument(doc: DocumentItem): void {
    this.previewDocument.set(doc);
  }

  openActionModal(item: BmLoanItem, action: BmActionType): void {
    this.selectedItem.set(item);
    this.currentAction.set(action);
    this.approvalForm.reset();
    this.isActionModalOpen.set(true);
  }

  closeActionModal(): void {
    this.isActionModalOpen.set(false);
    this.selectedItem.set(null);
    this.currentAction.set(null);
    this.approvalForm.reset();
  }

  submitApproval(): void {
    if (this.approvalForm.invalid) {
      this.approvalForm.markAllAsTouched();
      return;
    }

    const item = this.selectedItem();
    const action = this.currentAction();
    const formValue = this.approvalForm.getRawValue();

    if (!item || !action) return;

    this.isSubmitting.set(true);

    setTimeout(() => {
      this.queueItems.update((items) => items.filter((target) => target.id !== item.id));
      this.isSubmitting.set(false);
      this.closeActionModal();
    }, 500);
  }

  get modalTitle(): string {
    return this.currentAction() === 'APPROVE'
      ? 'Setujui Pengajuan Pinjaman (APPROVED BY BM)'
      : 'Tolak Pengajuan Pinjaman';
  }
}
