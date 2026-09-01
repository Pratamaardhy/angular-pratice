import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthStore } from '../../core/store/auth.store';
import { LoanApplicationItem, UserRole } from '../../core/models/loan-application.model';

@Component({
  selector: 'app-loan-application-list',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './loan-application-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanApplicationListComponent {
  readonly authStore = inject(AuthStore);

  // Filter & Search State
  readonly searchKeyword = signal('');
  readonly activeStatusFilter = signal<string>('ALL');

  // Active Role dari AuthStore (Default Mock untuk Simulasi Switcher)
  readonly activeRole = signal<UserRole>('MARKETING');

  // Dummy Data Berdasarkan Flowchart Database
  readonly applications = signal<LoanApplicationItem[]>([
    {
      id: 101,
      loanApplicationNo: 'APP-202608-001',
      customerName: 'Budi Santoso',
      customerNik: '3271012304920001',
      productName: 'Pinjaman Multiguna',
      amount: 50000000,
      tenorMonths: 24,
      statusCode: 'SUBMITTED',
      statusName: 'Pengajuan Baru',
      bankName: 'BCA',
      accountNumber: '1234567890',
      accountHolderName: 'Budi Santoso',
      createdAt: '2026-08-30T08:30:00Z',
    },
    {
      id: 102,
      loanApplicationNo: 'APP-202608-002',
      customerName: 'Siti Rahma',
      customerNik: '3271015508940003',
      productName: 'Modal Usaha',
      amount: 150000000,
      tenorMonths: 36,
      statusCode: 'REVIEWED',
      statusName: 'Lolos Review Marketing',
      bankName: 'Mandiri',
      accountNumber: '9876543210',
      accountHolderName: 'Siti Rahma',
      createdAt: '2026-08-29T10:15:00Z',
    },
    {
      id: 103,
      loanApplicationNo: 'APP-202608-003',
      customerName: 'Ahmad Fauzi',
      customerNik: '3271011211880005',
      productName: 'Pinjaman Express',
      amount: 25000000,
      tenorMonths: 12,
      statusCode: 'APPROVED_BY_BM',
      statusName: 'Disetujui BM',
      bankName: 'BRI',
      accountNumber: '5544332211',
      accountHolderName: 'Ahmad Fauzi',
      createdAt: '2026-08-28T14:20:00Z',
    },
    {
      id: 104,
      loanApplicationNo: 'APP-202608-004',
      customerName: 'Dewi Lestari',
      customerNik: '3271016002950002',
      productName: 'Modal Usaha',
      amount: 200000000,
      tenorMonths: 48,
      statusCode: 'DISBURSEMENT_PROCESS',
      statusName: 'Proses Pencairan',
      bankName: 'BCA',
      accountNumber: '8899001122',
      accountHolderName: 'Dewi Lestari',
      createdAt: '2026-08-27T09:00:00Z',
    },
  ]);

  // Computed Filter Data Sesuai Role
  readonly filteredApplications = computed(() => {
    const role = this.activeRole();
    const search = this.searchKeyword().toLowerCase();
    const filter = this.activeStatusFilter();

    return this.applications().filter((item) => {
      // 1. Role Scope Filter
      let matchesRoleScope = true;
      if (role === 'MARKETING') {
        matchesRoleScope = ['SUBMITTED', 'IN_REVIEW', 'NEED_ADDITIONAL_DATA'].includes(
          item.statusCode,
        );
      } else if (role === 'BRANCH_MANAGER') {
        matchesRoleScope = ['REVIEWED'].includes(item.statusCode);
      } else if (role === 'BACK_OFFICE') {
        matchesRoleScope = [
          'APPROVED_BY_BM',
          'NEED_ACCOUNT_CORRECTION',
          'DISBURSEMENT_PROCESS',
        ].includes(item.statusCode);
      }

      // 2. Search Filter
      const matchesSearch =
        item.loanApplicationNo.toLowerCase().includes(search) ||
        item.customerName.toLowerCase().includes(search) ||
        item.customerNik.includes(search);

      // 3. Status Dropdown Filter
      const matchesStatus = filter === 'ALL' || item.statusCode === filter;

      return matchesRoleScope && matchesSearch && matchesStatus;
    });
  });

  // Action Handlers
  switchRoleSimualtion(role: UserRole): void {
    this.activeRole.set(role);
  }

  handleMarketingReview(
    app: LoanApplicationItem,
    action: 'APPROVE' | 'REJECT' | 'REQUEST_DATA',
  ): void {
    console.log(`Marketing Action [${action}] for ${app.loanApplicationNo}`);
    // Panggil Service Update Status
  }

  handleBmApproval(app: LoanApplicationItem, action: 'APPROVE' | 'REJECT'): void {
    console.log(`BM Action [${action}] for ${app.loanApplicationNo}`);
    // Panggil Service Update Status
  }

  handleBackOfficeAction(app: LoanApplicationItem, action: 'VERIFY_BANK' | 'DISBURSE'): void {
    console.log(`Back Office Action [${action}] for ${app.loanApplicationNo}`);
    // Panggil Service Update Status
  }
}
