import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackOfficeActionType, BackOfficeLoanItem } from '../../core/models/back-office.model';
import { DocumentItem } from '../../core/models/marketing.model';

@Component({
  selector: 'app-back-office',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, CurrencyPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './back-office.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackOfficeComponent {
  readonly searchQuery = signal('');
  readonly selectedStatusFilter = signal<string>('ALL');

  readonly isActionModalOpen = signal(false);
  readonly selectedItem = signal<BackOfficeLoanItem | null>(null);
  readonly currentAction = signal<BackOfficeActionType | null>(null);
  readonly isSubmitting = signal(false);

  readonly isDetailModalOpen = signal(false);
  readonly previewDocument = signal<DocumentItem | null>(null);

  readonly actionForm;

  // Dummy Data Antrean Operasional Back Office
  readonly queueItems = signal<BackOfficeLoanItem[]>([
    {
      id: 401,
      loanApplicationNo: 'APP-202608-003',
      customerName: 'Ahmad Fauzi',
      customerNik: '3271011211880005',
      productName: 'Pinjaman Express',
      amount: 25000000,
      tenorMonths: 12,
      bankName: 'BRI',
      accountNumber: '5544332211',
      accountHolderName: 'Ahmad Fauzi',
      statusCode: 'APPROVED_BY_BM',
      statusName: 'APPROVED BY BM',
      bmApprovalNotes: 'Disetujui penuh sesuai rekomendasi marketing.',
      bmApprovedAt: '2026-08-30 16:00',
      createdAt: '2026-08-28 14:20',
      documents: [
        {
          id: 20,
          documentType: 'KTP',
          documentName: 'KTP_Ahmad_Fauzi.jpg',
          documentUrl: 'https://placehold.co/600x400/00236f/ffffff?text=KTP+Ahmad+Fauzi',
          uploadedAt: '2026-08-28 14:00',
        },
      ],
    },
    {
      id: 402,
      loanApplicationNo: 'APP-202608-004',
      customerName: 'Dewi Lestari',
      customerNik: '3271016002950002',
      productName: 'Modal Usaha',
      amount: 200000000,
      tenorMonths: 48,
      bankName: 'BCA',
      accountNumber: '8899001122',
      accountHolderName: 'Dewi Lestari',
      statusCode: 'DISBURSEMENT_PROCESS',
      statusName: 'DISBURSEMENT PROCESS',
      bmApprovalNotes: 'Pencairan diprioritaskan minggu ini.',
      bmApprovedAt: '2026-08-29 11:00',
      createdAt: '2026-08-27 09:00',
      documents: [
        {
          id: 21,
          documentType: 'KTP',
          documentName: 'KTP_Dewi_Lestari.jpg',
          documentUrl: 'https://placehold.co/600x400/00236f/ffffff?text=KTP+Dewi+Lestari',
          uploadedAt: '2026-08-27 08:30',
        },
      ],
    },
  ]);

  constructor(private fb: FormBuilder) {
    this.actionForm = this.fb.nonNullable.group({
      notes: ['', [Validators.required, Validators.minLength(5)]],
      referenceNo: [''], // Khusus jika action DISBURSE
    });
  }

  readonly filteredQueue = computed(() => {
    const search = this.searchQuery().toLowerCase();
    const filter = this.selectedStatusFilter();

    return this.queueItems().filter((item) => {
      const matchesSearch =
        item.loanApplicationNo.toLowerCase().includes(search) ||
        item.customerName.toLowerCase().includes(search) ||
        item.accountNumber.includes(search) ||
        item.customerNik.includes(search);

      const matchesStatus = filter === 'ALL' || item.statusCode === filter;

      return matchesSearch && matchesStatus;
    });
  });

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  openDetailModal(item: BackOfficeLoanItem): void {
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

  openActionModal(item: BackOfficeLoanItem, action: BackOfficeActionType): void {
    this.selectedItem.set(item);
    this.currentAction.set(action);
    this.actionForm.reset();

    // Jika pencairan, ref number wajib diisi
    if (action === 'DISBURSE') {
      this.actionForm.controls.referenceNo.setValidators([Validators.required]);
    } else {
      this.actionForm.controls.referenceNo.clearValidators();
    }
    this.actionForm.controls.referenceNo.updateValueAndValidity();

    this.isActionModalOpen.set(true);
  }

  closeActionModal(): void {
    this.isActionModalOpen.set(false);
    this.selectedItem.set(null);
    this.currentAction.set(null);
    this.actionForm.reset();
  }

  submitAction(): void {
    if (this.actionForm.invalid) {
      this.actionForm.markAllAsTouched();
      return;
    }

    const item = this.selectedItem();
    const action = this.currentAction();
    const formValue = this.actionForm.getRawValue();

    if (!item || !action) return;

    this.isSubmitting.set(true);

    setTimeout(() => {
      console.log(`[BACK OFFICE ACTION EXECUTED]`, {
        loanApplicationId: item.id,
        actionType: action,
        notes: formValue.notes,
        referenceNo: formValue.referenceNo,
      });

      this.queueItems.update((items) => items.filter((target) => target.id !== item.id));
      this.isSubmitting.set(false);
      this.closeActionModal();
    }, 500);
  }

  get modalTitle(): string {
    switch (this.currentAction()) {
      case 'VERIFY_ACCOUNT':
        return 'Validasi Rekening (Lanjut ke Process Disbursement)';
      case 'CORRECT_ACCOUNT':
        return 'Minta Perbaikan Rekening Bank';
      case 'DISBURSE':
        return 'Eksekusi Pencairan Dana (Mark as DISBURSED)';
      default:
        return 'Operasional Back Office';
    }
  }
}
