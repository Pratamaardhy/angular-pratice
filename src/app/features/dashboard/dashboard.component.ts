import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LoanItem {
  id: string;
  name: string;
  initials: string;
  amount: string;
  category: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  // 1. & 2. Variabel flag state menggunakan Signal untuk menandakan button sudah diklik
  isFilteredByPending = signal<boolean>(false);

  // State data tabel asli
  allLoans: LoanItem[] = [
    {
      id: 'APP-89012',
      name: 'John Doe',
      initials: 'JD',
      amount: 'Rp 25.000.000',
      category: 'Business Expansion',
      date: 'Today, 10:42 AM',
      status: 'Pending',
    },
    {
      id: 'APP-89011',
      name: 'Anna Smith',
      initials: 'AS',
      amount: 'Rp 10.000.000',
      category: 'Personal',
      date: 'Today, 09:15 AM',
      status: 'Approved',
    },
    {
      id: 'APP-89010',
      name: 'Michael King',
      initials: 'MK',
      amount: 'Rp 5.500.000',
      category: 'Education',
      date: 'Yesterday, 16:30 PM',
      status: 'Disbursed',
    },
  ];

  // Method trigger untuk mengubah nilai flag state
  toggleFilter() {
    this.isFilteredByPending.update((value) => !value);
  }

  // 3. Computed variable menggunakan Angular Signals untuk filtering data berdasarkan flag state
  filteredLoans = computed<LoanItem[]>(() => {
    if (this.isFilteredByPending()) {
      return this.allLoans.filter((loan) => loan.status === 'Pending');
    }
    return this.allLoans;
  });
}
