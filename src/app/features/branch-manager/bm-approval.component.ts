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

export interface BmLoanApplicationItem {
  id: number;
  loanApplicationNo: string;
  branchCode: string;
  branchName: string;

  // Profil Data Diri Konsumen (16 Fields Grid 4x4)
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

  // Detail Pengajuan Pinjaman Terstruktur
  productName: string;
  tenorMonths: number;
  maxPlafondLimit: number;
  requestedAmount: number;
  approvedAmount: number;
  remainingLimit: number;

  // Bank & Logo
  bankName: string;
  bankLogoUrl: string;
  accountNumber: string;
  accountHolderName: string;
  statusCode: string;
  statusName: string;
  createdAt: string;

  // Catatan Marketing Sebelumnya
  marketingNotes: string;
  marketingReviewerName: string;

  // Tier Options
  tierOptions: { tierLevel: number; amount: number }[];
  requestedTierLevel: number;

  documents: DocumentItem[];
}

@Component({
  selector: 'app-bm-approval',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule, ReactiveFormsModule],
  templateUrl: './bm-approval.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BmApprovalComponent {
  // Mode Tampilan Halaman: 'table' atau 'detail' (Berdiri sendiri)
  readonly viewMode = signal<'table' | 'detail'>('table');

  readonly currentBranch = signal('JAKARTA');
  readonly searchQuery = signal('');
  readonly selectedStatusFilter = signal<string>('ALL');

  // Dual Calendar Range Picker States
  readonly isDatePickerOpen = signal(false);
  readonly selectedStartDate = signal<Date | null>(null);
  readonly selectedEndDate = signal<Date | null>(null);
  readonly currentCalendarDate = signal<Date>(new Date(2026, 8, 1));

  // Pagination States
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(5);
  readonly pageSizeOptions = signal<number[]>([5, 10, 20, 30, 50, 100]);

  // Selected Detail Item & Document State
  readonly selectedDetailItem = signal<BmLoanApplicationItem | null>(null);
  readonly previewDocument = signal<DocumentItem | null>(null);

  // State Modal Form Action Approval / Downgrade BM
  readonly isActionModalOpen = signal(false);
  readonly currentAction = signal<'APPROVE' | 'REJECT' | null>(null);
  readonly isSubmitting = signal(false);

  readonly approvalForm: FormGroup;

  readonly queueItems = signal<BmLoanApplicationItem[]>([
    {
      id: 201,
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

      productName: 'Silver',
      tenorMonths: 3,
      maxPlafondLimit: 50000000,
      requestedAmount: 25000000,
      approvedAmount: 25000000,
      remainingLimit: 25000000,

      bankName: 'Mandiri',
      bankLogoUrl: 'https://placehold.co/120x40/003366/ffffff?text=Mandiri',
      accountNumber: '9876543210',
      accountHolderName: 'Siti Rahma',
      statusCode: 'REVIEWED',
      statusName: 'REVIEWED (MARKETING)',
      marketingNotes:
        'Usaha berjalan 3 tahun, arus kas stabil. Dokumen KTP & NPWP valid. Rekomendasi approval.',
      marketingReviewerName: 'Budi (Marketing JKT)',
      createdAt: '2026-09-01 10:15',

      tierOptions: [
        { tierLevel: 1, amount: 10000000 },
        { tierLevel: 2, amount: 15000000 },
        { tierLevel: 3, amount: 25000000 },
      ],
      requestedTierLevel: 3,

      documents: [
        {
          id: 10,
          documentType: 'KTP Pemohon',
          documentName: 'KTP_Siti.jpg',
          documentUrl: 'https://placehold.co/800x500/00236f/ffffff?text=KTP+Siti+Rahma',
          uploadedAt: '2026-09-01 10:00',
        },
        {
          id: 11,
          documentType: 'NPWP Usaha',
          documentName: 'NPWP_Siti.jpg',
          documentUrl: 'https://placehold.co/800x500/00236f/ffffff?text=NPWP+Siti+Rahma',
          uploadedAt: '2026-09-01 10:02',
        },
      ],
    },
    {
      id: 202,
      loanApplicationNo: 'APP-JKT-2026-008',
      branchCode: 'JAKARTA',
      branchName: 'Cabang Jakarta Selatan',
      customerName: 'Deni Kurniawan',
      customerNik: '3271011211900004',
      customerPhone: '081377665544',
      customerEmail: 'deni.kurniawan@gmail.com',
      province: 'DKI Jakarta',
      city: 'Jakarta Selatan',
      domicileAddress: 'Jl. Tebet Barat No. 42',
      motherMaidenName: 'Siti',
      occupation: 'Karyawan Swasta',
      jobPosition: 'Manager Operations',
      businessSector: 'Logistik',
      companyName: 'PT Logistik Maju',
      monthlyIncome: 18000000,
      fundSource: 'Gaji Bulanan',
      companyPhone: '021-88990011',
      companyAddress: 'Jl. Gatot Subroto No. 10',

      productName: 'Silver',
      tenorMonths: 3,
      maxPlafondLimit: 50000000,
      requestedAmount: 25000000,
      approvedAmount: 15000000,
      remainingLimit: 35000000,

      bankName: 'BCA',
      bankLogoUrl: 'https://placehold.co/120x40/00236f/ffffff?text=BCA',
      accountNumber: '5544332211',
      accountHolderName: 'Deni Kurniawan',
      statusCode: 'APPROVED_BY_BM',
      statusName: 'APPROVED BY BM',
      marketingNotes: 'Data lengkap, kapasitas angsuran DSR aman di Tier 2.',
      marketingReviewerName: 'Budi (Marketing JKT)',
      createdAt: '2026-09-01 11:30',

      tierOptions: [
        { tierLevel: 1, amount: 10000000 },
        { tierLevel: 2, amount: 15000000 },
        { tierLevel: 3, amount: 25000000 },
      ],
      requestedTierLevel: 3,

      documents: [],
    },
    {
      id: 203,
      loanApplicationNo: 'APP-JKT-2026-009',
      branchCode: 'JAKARTA',
      branchName: 'Cabang Jakarta Selatan',
      customerName: 'Hendra Gunawan',
      customerNik: '3271010101880009',
      customerPhone: '081211223344',
      customerEmail: 'hendra.gunawan@yahoo.com',
      province: 'DKI Jakarta',
      city: 'Jakarta Selatan',
      domicileAddress: 'Jl. Mampang Prapatan No. 9',
      motherMaidenName: 'Rina',
      occupation: 'Wiraswasta',
      jobPosition: 'Pemilik Toko',
      businessSector: 'Perdagangan',
      companyName: 'Toko Kelontong Hendra',
      monthlyIncome: 12000000,
      fundSource: 'Hasil Dagang',
      companyPhone: '021-77889900',
      companyAddress: 'Jl. Mampang Prapatan No. 9',

      productName: 'Silver',
      tenorMonths: 3,
      maxPlafondLimit: 50000000,
      requestedAmount: 25000000,
      approvedAmount: 0,
      remainingLimit: 50000000,

      bankName: 'BCA',
      bankLogoUrl: 'https://placehold.co/120x40/00236f/ffffff?text=BCA',
      accountNumber: '1122334455',
      accountHolderName: 'Hendra Gunawan',
      statusCode: 'REJECTED',
      statusName: 'REJECTED',
      marketingNotes: 'Riwayat pembiayaan kurang baik pada SLIK OJK.',
      marketingReviewerName: 'Budi (Marketing JKT)',
      createdAt: '2026-09-01 14:00',

      tierOptions: [
        { tierLevel: 1, amount: 10000000 },
        { tierLevel: 2, amount: 15000000 },
        { tierLevel: 3, amount: 25000000 },
      ],
      requestedTierLevel: 3,

      documents: [],
    },
  ]);

  constructor(private fb: FormBuilder) {
    this.approvalForm = this.fb.nonNullable.group({
      selectedTierLevel: [3, [Validators.required]],
      bmNotes: ['', [Validators.required, Validators.minLength(5)]],
      downgradeReason: [''],
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
      const matchesBranch = item.branchCode === this.currentBranch();
      const matchesSearch =
        item.loanApplicationNo.toLowerCase().includes(search) ||
        item.customerName.toLowerCase().includes(search) ||
        item.customerNik.includes(search);
      const matchesStatus = filter === 'ALL' || item.statusCode === filter;

      let matchesDate = true;
      const itemDate = new Date(item.createdAt);
      if (start && itemDate < this.stripTime(start)) matchesDate = false;
      if (end && itemDate > this.stripTime(end)) matchesDate = false;

      return matchesBranch && matchesSearch && matchesStatus && matchesDate;
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

  // Navigation Handlers
  goToDetailPage(item: BmLoanApplicationItem): void {
    this.selectedDetailItem.set(item);
    this.previewDocument.set(item.documents[0] ?? null);
    this.viewMode.set('detail');
  }

  goToTablePage(): void {
    this.viewMode.set('table');
    this.selectedDetailItem.set(null);
    this.previewDocument.set(null);
  }

  // Modal Action Handlers (Dipanggil dari Tombol Halaman Detail)
  openActionModal(action: 'APPROVE' | 'REJECT'): void {
    const item = this.selectedDetailItem();
    if (!item) return;

    this.currentAction.set(action);
    this.approvalForm.patchValue({
      selectedTierLevel: item.requestedTierLevel,
      bmNotes: '',
      downgradeReason: '',
    });

    this.isActionModalOpen.set(true);
  }

  closeActionModal(): void {
    this.isActionModalOpen.set(false);
    this.currentAction.set(null);
    this.approvalForm.reset();
  }

  isDowngradeSelected(): boolean {
    const item = this.selectedDetailItem();
    if (!item) return false;
    const selectedTier = Number(this.approvalForm.controls['selectedTierLevel'].value);
    return selectedTier < item.requestedTierLevel;
  }

  submitApproval(): void {
    const isDowngrade = this.isDowngradeSelected();

    if (isDowngrade) {
      this.approvalForm.controls['downgradeReason'].setValidators([
        Validators.required,
        Validators.minLength(5),
      ]);
    } else {
      this.approvalForm.controls['downgradeReason'].clearValidators();
    }
    this.approvalForm.controls['downgradeReason'].updateValueAndValidity();

    if (this.approvalForm.invalid) {
      this.approvalForm.markAllAsTouched();
      return;
    }

    const item = this.selectedDetailItem();
    const action = this.currentAction();
    if (!item || !action) return;

    this.isSubmitting.set(true);

    setTimeout(() => {
      if (action === 'APPROVE') {
        const selectedTier = Number(this.approvalForm.controls['selectedTierLevel'].value);
        const selectedTierObj = item.tierOptions.find((t) => t.tierLevel === selectedTier);
        const finalAmount = selectedTierObj ? selectedTierObj.amount : item.requestedAmount;

        this.queueItems.update((items) =>
          items.map((a) =>
            a.id === item.id
              ? {
                  ...a,
                  statusCode: 'APPROVED_BY_BM',
                  statusName: 'APPROVED BY BM',
                  approvedAmount: finalAmount,
                }
              : a,
          ),
        );
        alert(`Pengajuan ${item.loanApplicationNo} berhasil DISETUJUI oleh Branch Manager!`);
      } else if (action === 'REJECT') {
        this.queueItems.update((items) =>
          items.map((a) =>
            a.id === item.id ? { ...a, statusCode: 'REJECTED', statusName: 'REJECTED' } : a,
          ),
        );
        alert(`Pengajuan ${item.loanApplicationNo} telah DITOLAK.`);
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
      'No Telp Pemohon',
      'Email Pribadi',
      'Provinsi',
      'Kota',
      'Alamat Domisili',
      'Ibu Kandung',
      'Pekerjaan',
      'Nama Perusahaan',
      'Pendapatan Bulanan',
      'Produk',
      'Tenor (Bulan)',
      'Plafond Max',
      'Plafond Pengajuan',
      'Plafond Setujuan Final',
      'Sisa Limit',
      'Status',
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
        `"${item.province}"`,
        `"${item.city}"`,
        `"${item.domicileAddress}"`,
        `"${item.motherMaidenName}"`,
        `"${item.occupation}"`,
        `"${item.companyName}"`,
        item.monthlyIncome,
        `"${item.productName}"`,
        item.tenorMonths,
        item.maxPlafondLimit,
        item.requestedAmount,
        item.approvedAmount,
        item.remainingLimit,
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
      `BM_Approval_Pengajuan_${new Date().toISOString().slice(0, 10)}.csv`,
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
