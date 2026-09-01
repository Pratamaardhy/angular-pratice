import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../pengguna/components/confirm-modal/confirm-modal.component';

export interface SecUser {
  id: number;
  username: string;
  email: string;
  phone_number?: string;
  password_hash?: string;
  user_type: 'SUPERADMIN' | 'MARKETING' | 'BRANCH_MANAGER' | 'BACKOFFICE';
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
  last_login_at?: string;
  created_at: string;
}

@Component({
  selector: 'app-pengguna',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './pengguna.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PenggunaComponent {
  // State Data Users
  readonly users = signal<SecUser[]>([
    {
      id: 1,
      username: 'superadmin',
      email: 'superadmin@masesas.test',
      phone_number: '081234567890',
      user_type: 'SUPERADMIN',
      status: 'ACTIVE',
      last_login_at: '2026-08-28 09:30:15',
      created_at: '2026-01-10 08:00:00',
    },
    {
      id: 2,
      username: 'marketing_jkt',
      email: 'marketing@masesas.test',
      phone_number: '081987654321',
      user_type: 'MARKETING',
      status: 'ACTIVE',
      last_login_at: '2026-08-27 14:20:00',
      created_at: '2026-02-15 10:15:30',
    },
    {
      id: 3,
      username: 'bm_bdg',
      email: 'bm.bandung@masesas.test',
      phone_number: '085678901234',
      user_type: 'BRANCH_MANAGER',
      status: 'INACTIVE',
      last_login_at: '2026-07-11 11:00:00',
      created_at: '2026-03-01 09:00:00',
    },
    {
      id: 4,
      username: 'backoffice01',
      email: 'bo1@masesas.test',
      phone_number: '',
      user_type: 'BACKOFFICE',
      status: 'LOCKED',
      last_login_at: undefined,
      created_at: '2026-04-05 16:45:10',
    },
  ]);

  // Search & Filter & Pagination States
  readonly searchQuery = signal<string>('');
  readonly isFilteredActive = signal<boolean>(false);
  readonly currentPage = signal<number>(1);
  readonly pageSize = 5;

  // Modal Visibility States
  readonly isFormModalOpen = signal<boolean>(false);
  readonly isEditMode = signal<boolean>(false);
  readonly isDetailModalOpen = signal<boolean>(false);
  readonly showDeleteConfirmation = signal<boolean>(false);

  // Selected Item & Form State
  selectedUser: SecUser | null = null;
  selectedDeleteId: number | null = null;
  formData: Partial<SecUser> = this.resetFormData();

  // Filtered Computed List
  readonly filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const activeOnly = this.isFilteredActive();

    return this.users().filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.phone_number && user.phone_number.includes(query));

      const matchesActive = activeOnly ? user.status === 'ACTIVE' : true;

      return matchesSearch && matchesActive;
    });
  });

  // Total Pages Computed
  readonly totalPages = computed(() => {
    const total = Math.ceil(this.filteredUsers().length / this.pageSize);
    return total > 0 ? total : 1;
  });

  // Paginated Computed List
  readonly paginatedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredUsers().slice(start, start + this.pageSize);
  });

  // Toolbar Actions
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(1);
  }

  toggleFilter(): void {
    this.isFilteredActive.update((prev) => !prev);
    this.currentPage.set(1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // Modal Triggers
  openCreateModal(): void {
    this.isEditMode.set(false);
    this.formData = this.resetFormData();
    this.isFormModalOpen.set(true);
  }

  openEditModal(user: SecUser): void {
    this.isEditMode.set(true);
    this.selectedUser = user;
    this.formData = { ...user };
    this.isFormModalOpen.set(true);
  }

  openDetailModal(user: SecUser): void {
    this.selectedUser = user;
    this.isDetailModalOpen.set(true);
  }

  // Trigger Reusable Delete Confirmation Modal
  openDeleteModal(id: number): void {
    this.selectedDeleteId = id;
    this.showDeleteConfirmation.set(true);
  }

  closeModals(): void {
    this.isFormModalOpen.set(false);
    this.isDetailModalOpen.set(false);
    this.showDeleteConfirmation.set(false);
    this.selectedUser = null;
    this.selectedDeleteId = null;
  }

  // Save (Create/Update) Logic
  saveUser(): void {
    if (!this.formData.username || !this.formData.email) return;

    if (this.isEditMode() && this.selectedUser) {
      this.users.update((list) =>
        list.map((u) =>
          u.id === this.selectedUser!.id ? ({ ...u, ...this.formData } as SecUser) : u,
        ),
      );
    } else {
      const newUser: SecUser = {
        id: Date.now(),
        username: this.formData.username || '',
        email: this.formData.email || '',
        phone_number: this.formData.phone_number || '',
        user_type: this.formData.user_type || 'BACKOFFICE',
        status: this.formData.status || 'ACTIVE',
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      this.users.update((list) => [newUser, ...list]);
    }

    this.closeModals();
  }

  // Confirm Reusable Modal Action (DELETE)
  confirmDelete(): void {
    if (this.selectedDeleteId !== null) {
      this.users.update((list) => list.filter((u) => u.id !== this.selectedDeleteId));
    }
    this.closeModals();
  }

  private resetFormData(): Partial<SecUser> {
    return {
      username: '',
      email: '',
      phone_number: '',
      password_hash: '',
      user_type: 'BACKOFFICE',
      status: 'ACTIVE',
    };
  }
}