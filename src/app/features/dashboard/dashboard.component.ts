import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

export interface SummaryMetric {
  title: string;
  value: string | number;
  subtext: string;
  icon: string;
  colorClass: string;
}

export interface ActivityItem {
  id: number;
  loanNo: string;
  customerName: string;
  amount: number;
  branchName: string;
  status: string;
  statusBadgeClass: string;
  createdAt: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  // Kartu Ringkasan Metrik Terpadu (Unified Dashboard Metrics)
  readonly metrics = signal<SummaryMetric[]>([
    {
      title: 'Submitted',
      value: '14 App',
      subtext: 'Menunggu review awal',
      icon: 'send',
      colorClass: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Need Additional Data',
      value: '3 App',
      subtext: 'Butuh perbaikan berkas',
      icon: 'pending_actions',
      colorClass: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Approve BM',
      value: '28 App',
      subtext: 'Disetujui Branch Manager',
      icon: 'verified',
      colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Reject',
      value: '5 App',
      subtext: 'Pengajuan ditolak',
      icon: 'cancel',
      colorClass: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      title: 'Status Disburse',
      value: '22 App',
      subtext: 'Sudah dicairkan BO',
      icon: 'payments',
      colorClass: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      title: 'Total Aplikasi Aktif',
      value: '70 App',
      subtext: 'Dalam proses & aktif',
      icon: 'folder_open',
      colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      title: 'Total Pengajuan Nasional',
      value: 'Rp 14,8 Miliar',
      subtext: 'Volume nasional',
      icon: 'public',
      colorClass: 'bg-slate-100 text-[#00236f] border-slate-300',
    },
    {
      title: 'Total Dana Cair',
      value: 'Rp 10,2 Miliar',
      subtext: 'Total terealisasi',
      icon: 'price_check',
      colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
  ]);

  // Tabel Aktivitas Transaksi Pengajuan Terakhir
  readonly recentActivities = signal<ActivityItem[]>([
    {
      id: 1,
      loanNo: 'APP-JKT-2026-001',
      customerName: 'Budi Santoso',
      amount: 100000000,
      branchName: 'Cabang Jakarta Selatan',
      status: 'APPROVED BY BM',
      statusBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      createdAt: '2026-09-01 09:00',
    },
    {
      id: 2,
      loanNo: 'APP-BDG-2026-012',
      customerName: 'Dewi Lestari',
      amount: 100000000,
      branchName: 'Cabang Bandung Kota',
      status: 'SUBMITTED',
      statusBadgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      createdAt: '2026-09-01 11:30',
    },
    {
      id: 3,
      loanNo: 'APP-SBY-2026-008',
      customerName: 'Rian Hidayat',
      amount: 200000000,
      branchName: 'Cabang Surabaya Pusat',
      status: 'DISBURSED',
      statusBadgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
      createdAt: '2026-08-30 14:20',
    },
    {
      id: 4,
      loanNo: 'APP-JKT-2026-004',
      customerName: 'Ahmad Fauzi',
      amount: 75000000,
      branchName: 'Cabang Jakarta Selatan',
      status: 'NEED ADDITIONAL DATA',
      statusBadgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      createdAt: '2026-08-29 10:15',
    },
    {
      id: 5,
      loanNo: 'APP-BDG-2026-003',
      customerName: 'Siti Rahma',
      amount: 50000000,
      branchName: 'Cabang Bandung Kota',
      status: 'REJECTED',
      statusBadgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      createdAt: '2026-08-28 16:45',
    },
  ]);
}
