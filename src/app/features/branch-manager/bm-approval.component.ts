import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentItem, LoanApplicationItem } from '../../core/models/loan-application.model';

@Component({
  selector: 'app-bm-approval',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './bm-approval.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BmApprovalComponent {
  readonly currentBranch = signal('JAKARTA');
  readonly searchQuery = signal('');

  readonly isActionModalOpen = signal(false);
  readonly selectedItem = signal<LoanApplicationItem | null>(null);
  readonly currentAction = signal<'APPROVE' | 'REJECT' | null>(null);
  readonly isSubmitting = signal(false);

  readonly isDetailModalOpen = signal(false);
  readonly previewDocument = signal<DocumentItem | null>(null);

  // Form Approval BM dengan Pemilihan Tier
  readonly approvalForm;

  readonly queueItems = signal<LoanApplicationItem[]>([
    {
      id: 201,
      loanApplicationNo: 'APP-JKT-2026-005',
      branchCode: 'JAKARTA',
      branchName: 'Cabang Jakarta Selatan',
      customerName: 'Siti Rahma',
      customerNik: '3271015508940003',
      occupation: 'Pemilik Usaha Restoran',
      monthlyIncome: 35000000,
      bankName: 'Mandiri',
      accountNumber: '9876543210',
      accountHolderName: 'Siti Rahma',
      productName: 'Modal Usaha',
      tenorMonths: 36,
      tierOptions: [
        { tierLevel: 1, amount: 50000000 },
        { tierLevel: 2, amount: 100000000 },
        { tierLevel: 3, amount: 150000000 },
      ],
      requestedTierLevel: 3,
      requestedAmount: 150000000,
      statusCode: 'REVIEWED',
      statusName: 'REVIEWED (MARKETING)',
      marketingNotes: 'Usaha stabil 3 tahun, kelayakan finansial sangat baik.',
      marketingReviewerName: 'Budi (Marketing JKT)',
      createdAt: '2026-09-01 10:15',
      documents: [
        {
          id: 10,
          documentType: 'KTP',
          documentName: 'KTP_Siti.jpg',
          documentUrl: 'https://placehold.co/600x400/00236f/ffffff?text=KTP+Siti+Rahma',
          uploadedAt: '2026-09-01 10:00',
        },
      ],
    },
  ]);

  constructor(private fb: FormBuilder) {
    this.approvalForm = this.fb.nonNullable.group({
      selectedTierLevel: [3, [Validators.required]],
      bmNotes: ['', [Validators.required, Validators.minLength(5)]],
      downgradeReason: [''],
    });
  }

  readonly filteredQueue = computed(() => {
    const search = this.searchQuery().toLowerCase();
    return this.queueItems().filter((item) => {
      const matchesBranch = item.branchCode === this.currentBranch();
      const matchesSearch =
        item.loanApplicationNo.toLowerCase().includes(search) ||
        item.customerName.toLowerCase().includes(search) ||
        item.customerNik.includes(search);

      return matchesBranch && matchesSearch;
    });
  });

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  openActionModal(item: LoanApplicationItem, action: 'APPROVE' | 'REJECT'): void {
    this.selectedItem.set(item);
    this.currentAction.set(action);

    // Set default pilihan tier sesuai yang diminta nasabah
    this.approvalForm.patchValue({
      selectedTierLevel: item.requestedTierLevel,
      bmNotes: '',
      downgradeReason: '',
    });

    this.isActionModalOpen.set(true);
  }

  closeActionModal(): void {
    this.isActionModalOpen.set(false);
    this.selectedItem.set(null);
    this.currentAction.set(null);
    this.approvalForm.reset();
  }

  // Pengecekan apakah BM melakukan Downgrade Tier Plafond
  isDowngradeSelected(): boolean {
    const item = this.selectedItem();
    if (!item) return false;
    const selectedTier = Number(this.approvalForm.controls.selectedTierLevel.value);
    return selectedTier < item.requestedTierLevel;
  }

  submitApproval(): void {
    const isDowngrade = this.isDowngradeSelected();

    // Jika Downgrade, Alasan Wajib Diisi
    if (isDowngrade) {
      this.approvalForm.controls.downgradeReason.setValidators([
        Validators.required,
        Validators.minLength(5),
      ]);
    } else {
      this.approvalForm.controls.downgradeReason.clearValidators();
    }
    this.approvalForm.controls.downgradeReason.updateValueAndValidity();

    if (this.approvalForm.invalid) {
      this.approvalForm.markAllAsTouched();
      return;
    }

    const item = this.selectedItem();
    const action = this.currentAction();
    if (!item || !action) return;

    this.isSubmitting.set(true);

    setTimeout(() => {
      console.log('[BM DECISION EXECUTED]', {
        loanId: item.id,
        action,
        selectedTier: this.approvalForm.value.selectedTierLevel,
        isDowngrade,
        downgradeReason: this.approvalForm.value.downgradeReason,
      });

      this.queueItems.update((items) => items.filter((target) => target.id !== item.id));
      this.isSubmitting.set(false);
      this.closeActionModal();
    }, 500);
  }
}