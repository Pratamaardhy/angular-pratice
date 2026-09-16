import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface SuperadminDocumentItem {
  id: number;
  documentType: string;
  documentName: string;
  documentUrl: string;
  uploadedAt: string;
}

export interface SuperadminLoanApplicationItem {
  id: number;
  loanApplicationNo: string;
  branchCode: string;
  branchName: string;

  // Profil Data Diri Konsumen (Ditambahkan: Province, City, DomicileAddress)
  customerName: string;
  customerNik: string;
  customerPhone: string;
  customerEmail: string;
  province: string; // [BARU] Provinsi Domisili
  city: string; // [BARU] Kota/Kabupaten Domisili
  domicileAddress: string; // [BARU] Alamat Domisili Lengkap
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
  documents: SuperadminDocumentItem[];
}

@Component({
  selector: 'app-superadmin-loan-application',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './superadmin-loan-application.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperadminLoanApplicationComponent {
  readonly viewMode = signal<'table' | 'detail'>('table');

  // Filter States
  readonly searchQuery = signal('');
  readonly selectedBranchFilter = signal<string>('ALL');
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

  // Selected Detail Item & Preview State
  readonly selectedDetailItem = signal<SuperadminLoanApplicationItem | null>(null);
  readonly previewDocument = signal<SuperadminDocumentItem | null>(null);

  // Master Cabang
  readonly branches = signal([
    { branchCode: 'JAKARTA', branchName: 'Jakarta Selatan & Pusat' },
    { branchCode: 'BANDUNG', branchName: 'Bandung Kota' },
    { branchCode: 'SURABAYA', branchName: 'Surabaya Pusat' },
  ]);

  readonly applications = signal<SuperadminLoanApplicationItem[]>([
    {
      id: 1,
      loanApplicationNo: 'APP-JKT-2026-001',
      branchCode: 'JAKARTA',
      branchName: 'Cabang Jakarta Selatan',

      // Profil Data Diri Konsumen Dummy Lengkap dengan Provinsi, Kota, & Domisili
      customerName: 'Budi Santoso',
      customerNik: '3271012304920001',
      customerPhone: '081234567890',
      customerEmail: 'budi.santoso@gmail.com',
      province: 'DKI Jakarta',
      city: 'Jakarta Selatan',
      domicileAddress: 'Jl. Fatmawati Raya No. 12B, RT 004 / RW 002, Cilandak',
      motherMaidenName: 'Siti Aminah',
      occupation: 'Karyawan Swasta',
      jobPosition: 'Senior IT Officer',
      businessSector: 'Teknologi Informasi & Keuangan',
      companyName: 'PT BCA Finance Tbk',
      monthlyIncome: 15000000,
      fundSource: 'Gaji Bulanan Utama',
      companyPhone: '021-55443322',
      companyAddress: 'Jl. Jend. Sudirman No. 45, Jakarta Selatan',

      // Detail Pinjaman
      productName: 'Silver',
      tenorMonths: 3,
      maxPlafondLimit: 50000000,
      requestedAmount: 25000000,
      approvedAmount: 25000000,
      remainingLimit: 25000000,

      // Bank & Logo
      bankName: 'BCA',
      bankLogoUrl: 'https://placehold.co/120x40/00236f/ffffff?text=BCA',
      accountNumber: '1234567890',
      accountHolderName: 'Budi Santoso',
      statusCode: 'APPROVED_BY_BM',
      statusName: 'APPROVED BY BM',
      createdAt: '2026-09-01',
      documents: [
        {
          id: 101,
          documentType: 'Foto Selfie',
          documentName: 'Selfie_Budi.jpg',
          documentUrl: 'https://placehold.co/800x500/00236f/ffffff?text=Foto+Selfie+Budi',
          uploadedAt: '2026-09-01 08:45',
        },
        {
          id: 102,
          documentType: 'Foto KTP',
          documentName: 'KTP_Budi.jpg',
          documentUrl: 'https://placehold.co/800x500/00236f/ffffff?text=Foto+KTP+Budi',
          uploadedAt: '2026-09-01 08:50',
        },
        {
          id: 103,
          documentType: 'Slip Gaji',
          documentName: 'SlipGaji_Budi.pdf',
          documentUrl: 'https://placehold.co/800x500/00236f/ffffff?text=Slip+Gaji+Budi',
          uploadedAt: '2026-09-01 08:55',
        },
      ],
    },
    {
      id: 2,
      loanApplicationNo: 'APP-BDG-2026-012',
      branchCode: 'BANDUNG',
      branchName: 'Cabang Bandung Kota',
      customerName: 'Dewi Lestari',
      customerNik: '3273014405930002',
      customerPhone: '081987654321',
      customerEmail: 'dewi.lestari@yahoo.com',
      province: 'Jawa Barat',
      city: 'Kota Bandung',
      domicileAddress: 'Jl. Dago Asri No. 88, Kecamatan Coblong',
      motherMaidenName: 'Kartini',
      occupation: 'Wiraswasta',
      jobPosition: 'Pemilik Usaha',
      businessSector: 'Kuliner & Restoran',
      companyName: 'Resto Sunda Nikmat',
      monthlyIncome: 28000000,
      fundSource: 'Hasil Usaha Restoran',
      companyPhone: '022-4201234',
      companyAddress: 'Jl. Riau No. 12, Bandung',

      productName: 'Silver',
      tenorMonths: 3,
      maxPlafondLimit: 50000000,
      requestedAmount: 25000000,
      approvedAmount: 25000000,
      remainingLimit: 25000000,

      bankName: 'Mandiri',
      bankLogoUrl: 'https://placehold.co/120x40/003366/ffffff?text=Mandiri',
      accountNumber: '8877665544',
      accountHolderName: 'Dewi Lestari',
      statusCode: 'SUBMITTED',
      statusName: 'SUBMITTED',
      createdAt: '2026-09-01',
      documents: [],
    },
  ]);

  // Computed Date Grid
  readonly leftCalendarMonth = computed(() => this.currentCalendarDate());
  readonly rightCalendarMonth = computed(() => {
    const d = new Date(this.currentCalendarDate());
    d.setMonth(d.getMonth() + 1);
    return d;
  });

  readonly leftDaysGrid = computed(() => this.generateDaysGrid(this.leftCalendarMonth()));
  readonly rightDaysGrid = computed(() => this.generateDaysGrid(this.rightCalendarMonth()));

  // Filter Computed Data
  readonly filteredApplications = computed(() => {
    const search = this.searchQuery().toLowerCase();
    const branch = this.selectedBranchFilter();
    const status = this.selectedStatusFilter();
    const start = this.selectedStartDate();
    const end = this.selectedEndDate();

    return this.applications().filter((item) => {
      const matchesSearch =
        item.loanApplicationNo.toLowerCase().includes(search) ||
        item.customerName.toLowerCase().includes(search) ||
        item.customerNik.includes(search);

      const matchesBranch = branch === 'ALL' || item.branchCode === branch;
      const matchesStatus = status === 'ALL' || item.statusCode === status;

      let matchesDate = true;
      const itemDate = new Date(item.createdAt);
      if (start && itemDate < this.stripTime(start)) matchesDate = false;
      if (end && itemDate > this.stripTime(end)) matchesDate = false;

      return matchesSearch && matchesBranch && matchesStatus && matchesDate;
    });
  });

  // Pagination Computations
  readonly totalItems = computed(() => this.filteredApplications().length);
  readonly totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()) || 1);

  readonly paginatedApplications = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const startIndex = (page - 1) * size;
    return this.filteredApplications().slice(startIndex, startIndex + size);
  });

  exportData(): void {
    const dataToExport = this.filteredApplications();
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
      `Pengajuan_Pinjaman_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  goToDetailPage(item: SuperadminLoanApplicationItem): void {
    this.selectedDetailItem.set(item);
    this.previewDocument.set(item.documents[0] ?? null);
    this.viewMode.set('detail');
  }

  goToTablePage(): void {
    this.viewMode.set('table');
    this.selectedDetailItem.set(null);
    this.previewDocument.set(null);
  }

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

  setPreviewDocument(doc: SuperadminDocumentItem): void {
    this.previewDocument.set(doc);
  }
}
