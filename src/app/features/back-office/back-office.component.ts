import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

export interface DocumentItem {
  id: number;
  documentType: string;
  documentName: string;
  documentUrl: string;
  uploadedAt: string;
}

export interface BackOfficeLoanApplicationItem {
  id: number;
  loanApplicationNo: string;
  branchCode: string;
  branchName: string;

  // Profil Data Diri Konsumen Lengkap
  customerName: string;
  customerNik: string;
  customerPhone: string;
  customerEmail: string;
  province: string;
  city: string;
  domicileAddress: string;
  motherMaidenName: string;
  occupation: string;
  jobPosition: string;
  businessSector: string;
  companyName: string;
  monthlyIncome: number;
  fundSource: string;
  companyPhone: string;
  companyAddress: string;

  // Detail Pengajuan & Plafond
  productName: string;
  tenorMonths: number;
  maxPlafondLimit: number;
  requestedAmount: number;
  approvedAmount: number;
  remainingLimit: number;
  approvedTierLevel?: number;
  requestedTierLevel: number;

  // Target Rekening Bank Transfer
  bankName: string;
  bankLogoUrl: string;
  accountNumber: string;
  accountHolderName: string;

  // Status Operasional Back Office
  statusCode: 'APPROVED_BY_BM' | 'DISBURSEMENT_PROCESS' | 'DISBURSED' | 'REJECTED_DISBURSEMENT';
  statusName: string;
  createdAt: string;

  // Audit Notes & History Approval
  marketingNotes?: string;
  marketingReviewerName?: string;
  bmNotes?: string;
  downgradeReason?: string;

  documents: DocumentItem[];
}

@Component({
  selector: 'app-back-office',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule, ReactiveFormsModule],
  templateUrl: './back-office.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackOfficeComponent {
  // Navigation Mode View: Table List vs Detail Profile
  readonly viewMode = signal<'table' | 'detail'>('table');

  readonly searchQuery = signal('');

  // Status Filter Options
  readonly selectedStatusFilter = signal<string>('ALL');

  // Dual Calendar Range Picker State
  readonly isDatePickerOpen = signal(false);
  readonly selectedStartDate = signal<Date | null>(null);
  readonly selectedEndDate = signal<Date | null>(null);
  readonly currentCalendarDate = signal<Date>(new Date(2026, 8, 1));

  // Pagination States
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(5);
  readonly pageSizeOptions = signal<number[]>([5, 10, 20, 30, 50, 100]);

  // Selected Detail Item & Document Preview
  readonly selectedDetailItem = signal<BackOfficeLoanApplicationItem | null>(null);
  readonly previewDocument = signal<DocumentItem | null>(null);

  // Modal Action Form (Cairkan Dana vs Reject)
  readonly isActionModalOpen = signal(false);
  readonly currentAction = signal<'DISBURSE' | 'REJECT_DISBURSEMENT' | null>(null);
  readonly isSubmitting = signal(false);

  readonly actionForm: FormGroup;

  readonly queueItems = signal<BackOfficeLoanApplicationItem[]>([
    {
      id: 301,
      loanApplicationNo: 'APP-JKT-2026-001',
      branchCode: 'JAKARTA',
      branchName: 'Cabang Jakarta Selatan',
      customerName: 'Budi Santoso',
      customerNik: '3271012304920001',
      customerPhone: '081234567890',
      customerEmail: 'budi.santoso@gmail.com',
      province: 'DKI Jakarta',
      city: 'Jakarta Selatan',
      domicileAddress: 'Jl. Fatmawati Raya No. 12B, Cilandak',
      motherMaidenName: 'Siti Aminah',
      occupation: 'Karyawan Swasta',
      jobPosition: 'Senior IT Officer',
      businessSector: 'Teknologi Informasi & Keuangan',
      companyName: 'PT BCA Finance Tbk',
      monthlyIncome: 15000000,
      fundSource: 'Gaji Bulanan Utama',
      companyPhone: '021-55443322',
      companyAddress: 'Jl. Jend. Sudirman No. 45, Jakarta Selatan',

      productName: 'Silver Multiguna',
      tenorMonths: 24,
      maxPlafondLimit: 150000000,
      requestedAmount: 150000000,
      approvedAmount: 100000000,
      remainingLimit: 50000000,
      requestedTierLevel: 3,
      approvedTierLevel: 2,

      bankName: 'BCA',
      bankLogoUrl: 'https://placehold.co/120x40/00236f/ffffff?text=BCA',
      accountNumber: '1234567890',
      accountHolderName: 'Budi Santoso',
      statusCode: 'APPROVED_BY_BM',
      statusName: 'APPROVED BY BM',
      marketingNotes: 'Dokumen lengkap, verifikasi awal oke.',
      marketingReviewerName: 'Analis Marketing JKT',
      bmNotes: 'Persetujuan disesuaikan ke Tier 2 (Rp 100 Juta) pertimbangan rasio DSR.',
      downgradeReason: 'Debt Service Ratio (DSR) di atas 40%',
      createdAt: '2026-09-01 09:00',
      documents: [
        {
          id: 30,
          documentType: 'Halaman Depan Buku Tabungan',
          documentName: 'BukuTabungan_Budi.jpg',
          documentUrl: 'https://placehold.co/800x500/00236f/ffffff?text=Buku+Tabungan+BCA+Budi',
          uploadedAt: '2026-09-01 08:55',
        },
        {
          id: 31,
          documentType: 'KTP Pemohon',
          documentName: 'KTP_Budi.jpg',
          documentUrl: 'https://placehold.co/800x500/00236f/ffffff?text=KTP+Budi+Santoso',
          uploadedAt: '2026-09-01 08:50',
        },
      ],
    },
    {
      id: 302,
      loanApplicationNo: 'APP-JKT-2026-005',
      branchCode: 'JAKARTA',
      branchName: 'Cabang Jakarta Selatan',
      customerName: 'Siti Rahma',
      customerNik: '3271015508940003',
      customerPhone: '081299887766',
      customerEmail: 'siti.rahma@gmail.com',
      province: 'DKI Jakarta',
      city: 'Jakarta Selatan',
      domicileAddress: 'Jl. Radio Dalam No. 15, Kebayoran Baru',
      motherMaidenName: 'Halimah',
      occupation: 'Pemilik Usaha Restoran',
      jobPosition: 'Owner / Direktur Utama',
      businessSector: 'Kuliner & F&B',
      companyName: 'Resto Dapur Nusantara',
      monthlyIncome: 35000000,
      fundSource: 'Hasil Omzet Usaha Restoran',
      companyPhone: '021-7201234',
      companyAddress: 'Jl. Gandaria Tengah No. 8, Jakarta Selatan',

      productName: 'Silver Multiguna',
      tenorMonths: 12,
      maxPlafondLimit: 50000000,
      requestedAmount: 25000000,
      approvedAmount: 25000000,
      remainingLimit: 25000000,
      requestedTierLevel: 1,
      approvedTierLevel: 1,

      bankName: 'Mandiri',
      bankLogoUrl: 'https://placehold.co/120x40/003366/ffffff?text=Mandiri',
      accountNumber: '9876543210',
      accountHolderName: 'Siti Rahma',
      statusCode: 'DISBURSEMENT_PROCESS',
      statusName: 'DISBURSEMENT PROCESS',
      marketingNotes: 'Usaha stabil, verifikasi rekening valid.',
      marketingReviewerName: 'Analis Marketing JKT',
      bmNotes: 'Disetujui penuh sesuai pilihan nasabah.',
      createdAt: '2026-09-01 10:15',
      documents: [],
    },
    {
      id: 303,
      loanApplicationNo: 'APP-BDG-2026-009',
      branchCode: 'BANDUNG',
      branchName: 'Cabang Bandung City',
      customerName: 'Ahmad Fauzi',
      customerNik: '3273041211880003',
      customerPhone: '081987654321',
      customerEmail: 'ahmad.fauzi@gmail.com',
      province: 'Jawa Barat',
      city: 'Bandung',
      domicileAddress: 'Jl. Dago No. 88, Coblong',
      motherMaidenName: 'Marlina',
      occupation: 'Karyawan Swasta',
      jobPosition: 'Software Engineer',
      businessSector: 'Teknologi Informasi',
      companyName: 'PT Tech Innovation',
      monthlyIncome: 18000000,
      fundSource: 'Gaji Bulanan',
      companyPhone: '022-4201122',
      companyAddress: 'Jl. Asia Afrika No. 10, Bandung',

      productName: 'Gold Multiguna',
      tenorMonths: 36,
      maxPlafondLimit: 200000000,
      requestedAmount: 120000000,
      approvedAmount: 120000000,
      remainingLimit: 80000000,
      requestedTierLevel: 2,
      approvedTierLevel: 2,

      bankName: 'BCA',
      bankLogoUrl: 'https://placehold.co/120x40/00236f/ffffff?text=BCA',
      accountNumber: '5544332211',
      accountHolderName: 'Ahmad Fauzi',
      statusCode: 'DISBURSED',
      statusName: 'DISBURSED',
      marketingNotes: 'Validasi berkas oke.',
      marketingReviewerName: 'Marketing BDG',
      bmNotes: 'Persetujuan disetujui penuh.',
      createdAt: '2026-08-28 14:00',
      documents: [],
    },
  ]);

  constructor(private fb: FormBuilder) {
    this.actionForm = this.fb.nonNullable.group({
      referenceNo: [''],
      notes: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  // Calendar Computations
  readonly leftCalendarMonth = computed(() => this.currentCalendarDate());
  readonly rightCalendarMonth = computed(() => {
    const d = new Date(this.currentCalendarDate());
    d.setMonth(d.getMonth() + 1);
    return d;
  });

  readonly leftDaysGrid = computed(() => this.generateDaysGrid(this.leftCalendarMonth()));
  readonly rightDaysGrid = computed(() => this.generateDaysGrid(this.rightCalendarMonth()));

  // Filter Computations
  readonly filteredQueue = computed(() => {
    const search = this.searchQuery().toLowerCase();
    const filter = this.selectedStatusFilter();
    const start = this.selectedStartDate();
    const end = this.selectedEndDate();

    return this.queueItems().filter((item) => {
      const matchesSearch =
        item.loanApplicationNo.toLowerCase().includes(search) ||
        item.customerName.toLowerCase().includes(search) ||
        item.accountNumber.includes(search) ||
        item.customerNik.includes(search);

      const matchesStatus = filter === 'ALL' || item.statusCode === filter;

      let matchesDate = true;
      const itemDate = new Date(item.createdAt);
      if (start && itemDate < this.stripTime(start)) matchesDate = false;
      if (end && itemDate > this.stripTime(end)) matchesDate = false;

      return matchesSearch && matchesStatus && matchesDate;
    });
  });

  // Pagination Computations
  readonly totalItems = computed(() => this.filteredQueue().length);
  readonly totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()) || 1);

  readonly paginatedQueue = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const startIndex = (page - 1) * size;
    return this.filteredQueue().slice(startIndex, startIndex + size);
  });

  // Navigation Mode Handlers
  goToDetailPage(item: BackOfficeLoanApplicationItem): void {
    this.selectedDetailItem.set(item);
    this.previewDocument.set(item.documents[0] ?? null);
    this.viewMode.set('detail');
  }

  goToTablePage(): void {
    this.viewMode.set('table');
    this.selectedDetailItem.set(null);
    this.previewDocument.set(null);
  }

  // Action Modal Handlers
  openActionModal(action: 'DISBURSE' | 'REJECT_DISBURSEMENT'): void {
    const item = this.selectedDetailItem();
    if (!item) return;

    this.currentAction.set(action);
    this.actionForm.reset();

    if (action === 'DISBURSE') {
      this.actionForm.controls['referenceNo'].setValidators([Validators.required]);
    } else {
      this.actionForm.controls['referenceNo'].clearValidators();
    }
    this.actionForm.controls['referenceNo'].updateValueAndValidity();

    this.isActionModalOpen.set(true);
  }

  closeActionModal(): void {
    this.isActionModalOpen.set(false);
    this.currentAction.set(null);
    this.actionForm.reset();
  }

  submitAction(): void {
    if (this.actionForm.invalid) {
      this.actionForm.markAllAsTouched();
      return;
    }

    const item = this.selectedDetailItem();
    const action = this.currentAction();
    if (!item || !action) return;

    this.isSubmitting.set(true);

    setTimeout(() => {
      if (action === 'DISBURSE') {
        this.queueItems.update((items) =>
          items.map((a) =>
            a.id === item.id ? { ...a, statusCode: 'DISBURSED', statusName: 'DISBURSED' } : a,
          ),
        );
        alert(`Pencairan dana ${item.loanApplicationNo} BERHASIL diproses! Status kini DISBURSED.`);
      } else if (action === 'REJECT_DISBURSEMENT') {
        this.queueItems.update((items) =>
          items.map((a) =>
            a.id === item.id
              ? { ...a, statusCode: 'REJECTED_DISBURSEMENT', statusName: 'REJECTED DISBURSEMENT' }
              : a,
          ),
        );
        alert(`Pencairan dana pengajuan ${item.loanApplicationNo} DITOLAK.`);
      }

      this.isSubmitting.set(false);
      this.closeActionModal();
      this.goToTablePage();
    }, 500);
  }

  // Export Data CSV
  exportData(): void {
    const dataToExport = this.filteredQueue();
    if (dataToExport.length === 0) {
      alert('Tidak ada data yang dapat diexport berdasarkan filter periode saat ini.');
      return;
    }

    const headers = [
      'No Pengajuan',
      'Tanggal',
      'Cabang',
      'Nama Nasabah',
      'NIK',
      'No Telp',
      'Email',
      'Bank Target',
      'No Rekening',
      'Atas Nama',
      'Produk',
      'Approved Amount',
      'Status Operasional',
    ];

    const csvRows = [headers.join(',')];

    dataToExport.forEach((item) => {
      const row = [
        `"${item.loanApplicationNo}"`,
        `"${item.createdAt}"`,
        `"${item.branchName}"`,
        `"${item.customerName}"`,
        `"${item.customerNik}"`,
        `"${item.customerPhone}"`,
        `"${item.customerEmail}"`,
        `"${item.bankName}"`,
        `"${item.accountNumber}"`,
        `"${item.accountHolderName}"`,
        `"${item.productName}"`,
        item.approvedAmount,
        `"${item.statusName}"`,
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `BackOffice_Disbursement_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Calendar Helpers
  toggleDatePicker(): void {
    this.isDatePickerOpen.update((v) => !v);
  }

  prevMonth(): void {
    const d = new Date(this.currentCalendarDate());
    d.setMonth(d.getMonth() - 1);
    this.currentCalendarDate.set(d);
  }

  nextMonth(): void {
    const d = new Date(this.currentCalendarDate());
    d.setMonth(d.getMonth() + 1);
    this.currentCalendarDate.set(d);
  }

  selectDate(date: Date): void {
    const start = this.selectedStartDate();
    const end = this.selectedEndDate();

    if (!start || (start && end)) {
      this.selectedStartDate.set(date);
      this.selectedEndDate.set(null);
    } else if (start && !end) {
      if (date < start) {
        this.selectedStartDate.set(date);
      } else {
        this.selectedEndDate.set(date);
      }
    }
  }

  resetPeriode(): void {
    this.selectedStartDate.set(null);
    this.selectedEndDate.set(null);
    this.currentPage.set(1);
  }

  applyPeriode(): void {
    this.isDatePickerOpen.set(false);
    this.currentPage.set(1);
  }

  isDateSelected(date: Date): boolean {
    const start = this.selectedStartDate();
    const end = this.selectedEndDate();
    if (!start) return false;
    if (this.isSameDay(date, start)) return true;
    if (end && this.isSameDay(date, end)) return true;
    return false;
  }

  isDateInRange(date: Date): boolean {
    const start = this.selectedStartDate();
    const end = this.selectedEndDate();
    if (!start || !end) return false;
    return date > start && date < end;
  }

  private generateDaysGrid(monthDate: Date): (Date | null)[] {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) grid.push(null);
    for (let day = 1; day <= daysInMonth; day++) grid.push(new Date(year, month, day));
    return grid;
  }

  private isSameDay(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  private stripTime(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }

  onFilterChange(): void {
    this.currentPage.set(1);
  }

  onPageSizeChange(event: Event): void {
    const newSize = Number((event.target as HTMLSelectElement).value);
    this.pageSize.set(newSize);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  setPreviewDocument(doc: DocumentItem): void {
    this.previewDocument.set(doc);
  }
}
