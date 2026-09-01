import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoanApplicationItem, UserRole } from '../../core/models/loan-application.model';

@Component({
  selector: 'app-loan-application-list',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './loan-application-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanApplicationListComponent {
  readonly activeRole = signal<UserRole>('MARKETING');
  readonly currentBranch = signal('JAKARTA');

  readonly searchKeyword = signal('');
  readonly activeStatusFilter = signal<string>('ALL');

  readonly isActionModalOpen = signal(false);
  readonly selectedItem = signal<LoanApplicationItem | null>(null);
  readonly currentActionType = signal<string | null>(null);
  readonly isSubmitting = signal(false);

  readonly modalForm;

  readonly applications = signal<LoanApplicationItem[]>([
    {
      id: 1,
      loanApplicationNo: 'APP-JKT-2026-001',
      branchCode: 'JAKARTA',
      branchName: 'Cabang Jakarta Selatan',
      customerName: 'Budi Santoso',
      customerNik: '3271012304920001',
      occupation: 'Karyawan Swasta',
      monthlyIncome: 12500000,
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
      documents: [],
    },
    {
      id: 2,
      loanApplicationNo: 'APP-JKT-2026-002',
      branchCode: 'JAKARTA',
      branchName: 'Cabang Jakarta Selatan',
      customerName: 'Siti Rahma',
      customerNik: '3271015508940003',
      occupation: 'Wiraswasta',
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
      marketingNotes: 'Usaha stabil, dokumen lengkap, rasio kelayakan baik.',
      marketingReviewerName: 'Budi (Marketing)',
      createdAt: '2026-09-01 10:00',
      documents: [],
    },
    {
      id: 3,
      loanApplicationNo: 'APP-JKT-2026-003',
      branchCode: 'JAKARTA',
      branchName: 'Cabang Jakarta Pusat',
      customerName: 'Ahmad Fauzi',
      customerNik: '3271011211880005',
      occupation: 'Professional',
      monthlyIncome: 20000000,
      bankName: 'BRI',
      accountNumber: '5544332211',
      accountHolderName: 'Ahmad Fauzi',
      productName: 'Pinjaman Express',
      tenorMonths: 12,
      tierOptions: [
        { tierLevel: 1, amount: 50000000 },
        { tierLevel: 2, amount: 100000000 },
      ],
      requestedTierLevel: 2,
      requestedAmount: 100000000,
      approvedTierLevel: 2,
      approvedAmount: 100000000,
      statusCode: 'APPROVED_BY_BM',
      statusName: 'APPROVED BY BM',
      createdAt: '2026-08-31 14:00',
      documents: [],
    },
  ]);

  constructor(private fb: FormBuilder) {
    this.modalForm = this.fb.nonNullable.group({
      notes: ['', [Validators.required, Validators.minLength(5)]],
      selectedTierLevel: [3],
      downgradeReason: [''],
      referenceNo: [''],
    });
  }

  readonly filteredApplications = computed(() => {
    const role = this.activeRole();
    const branch = this.currentBranch();
    const search = this.searchKeyword().toLowerCase();
    const status = this.activeStatusFilter();

    return this.applications().filter((item) => {
      const matchesBranch = item.branchCode === branch;
      const matchesSearch =
        item.loanApplicationNo.toLowerCase().includes(search) ||
        item.customerName.toLowerCase().includes(search) ||
        item.customerNik.includes(search);

      let matchesRoleScope = true;
      if (role === 'MARKETING') {
        matchesRoleScope =
          item.statusCode === 'SUBMITTED' || item.statusCode === 'NEED_ADDITIONAL_DATA';
      } else if (role === 'BRANCH_MANAGER') {
        matchesRoleScope = item.statusCode === 'REVIEWED';
      } else if (role === 'BACKOFFICE') {
        matchesRoleScope =
          item.statusCode === 'APPROVED_BY_BM' || item.statusCode === 'DISBURSEMENT_PROCESS';
      }

      const matchesStatus = status === 'ALL' || item.statusCode === status;

      return matchesBranch && matchesSearch && matchesRoleScope && matchesStatus;
    });
  });

  switchRoleSimulation(role: UserRole): void {
    this.activeRole.set(role);
    this.activeStatusFilter.set('ALL');
  }

  openActionModal(item: LoanApplicationItem, actionType: string): void {
    this.selectedItem.set(item);
    this.currentActionType.set(actionType);

    this.modalForm.patchValue({
      notes: '',
      selectedTierLevel: item.requestedTierLevel,
      downgradeReason: '',
      referenceNo: '',
    });

    this.isActionModalOpen.set(true);
  }

  closeActionModal(): void {
    this.isActionModalOpen.set(false);
    this.selectedItem.set(null);
    this.currentActionType.set(null);
    this.modalForm.reset();
  }

  isDowngradeSelected(): boolean {
    const item = this.selectedItem();
    if (!item) return false;
    const selected = Number(this.modalForm.controls.selectedTierLevel.value);
    return selected < item.requestedTierLevel;
  }

  submitAction(): void {
    const action = this.currentActionType();
    const isDowngrade = this.isDowngradeSelected();

    if (action === 'BM_APPROVE' && isDowngrade) {
      this.modalForm.controls.downgradeReason.setValidators([
        Validators.required,
        Validators.minLength(5),
      ]);
    } else {
      this.modalForm.controls.downgradeReason.clearValidators();
    }
    this.modalForm.controls.downgradeReason.updateValueAndValidity();

    if (this.modalForm.invalid) {
      this.modalForm.markAllAsTouched();
      return;
    }

    const item = this.selectedItem();
    if (!item) return;

    this.isSubmitting.set(true);

    setTimeout(() => {
      this.applications.update((items) => items.filter((target) => target.id !== item.id));
      this.isSubmitting.set(false);
      this.closeActionModal();
    }, 500);
  }
}
