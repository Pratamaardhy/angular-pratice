import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoanApplicationItem } from '../../core/models/loan-application.model';

@Component({
  selector: 'app-back-office',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './back-office.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackOfficeComponent {
  readonly searchQuery = signal('');
  readonly selectedStatusFilter = signal<string>('ALL');

  readonly isActionModalOpen = signal(false);
  readonly selectedItem = signal<LoanApplicationItem | null>(null);
  readonly currentAction = signal<'VERIFY_ACCOUNT' | 'DISBURSE' | null>(null);
  readonly isSubmitting = signal(false);

  readonly actionForm;

  readonly queueItems = signal<LoanApplicationItem[]>([
    {
      id: 301,
      loanApplicationNo: 'APP-JKT-2026-001',
      branchCode: 'JAKARTA',
      branchName: 'Cabang Jakarta Selatan',
      customerName: 'Budi Santoso',
      customerNik: '3271012304920001',
      occupation: 'Karyawan Swasta',
      monthlyIncome: 15000000,
      bankName: 'BCA',
      accountNumber: '1234567890',
      accountHolderName: 'Budi Santoso',
      productName: 'Pinjaman Multiguna',
      tenorMonths: 24,
      tierOptions: [],
      requestedTierLevel: 3,
      requestedAmount: 150000000,
      approvedTierLevel: 2,
      approvedAmount: 100000000, // Di-downgrade ke Tier 2 & Disetujui Nasabah
      statusCode: 'APPROVED_BY_BM',
      statusName: 'APPROVED BY BM',
      bmNotes: 'Pencairan disetujui sebesar Rp 100.000.000 (Tier 2)',
      createdAt: '2026-09-01 09:00',
      documents: [],
    },
  ]);

  constructor(private fb: FormBuilder) {
    this.actionForm = this.fb.nonNullable.group({
      referenceNo: ['', [Validators.required]],
      notes: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  readonly filteredQueue = computed(() => {
    const search = this.searchQuery().toLowerCase();
    const filter = this.selectedStatusFilter();

    return this.queueItems().filter((item) => {
      const matchesSearch =
        item.loanApplicationNo.toLowerCase().includes(search) ||
        item.customerName.toLowerCase().includes(search) ||
        item.accountNumber.includes(search);
      const matchesStatus = filter === 'ALL' || item.statusCode === filter;

      return matchesSearch && matchesStatus;
    });
  });

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  openActionModal(item: LoanApplicationItem, action: 'VERIFY_ACCOUNT' | 'DISBURSE'): void {
    this.selectedItem.set(item);
    this.currentAction.set(action);
    this.actionForm.reset();
    this.isActionModalOpen.set(true);
  }

  closeActionModal(): void {
    this.isActionModalOpen.set(false);
    this.selectedItem.set(null);
  }

  submitAction(): void {
    if (this.actionForm.invalid) {
      this.actionForm.markAllAsTouched();
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
