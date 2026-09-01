import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  RbacService,
  UserStaffEntity,
  PermissionEntity,
  UserType,
} from '../../core/services/rbac/rbac.service';

@Component({
  selector: 'app-rbac',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rbac.component.html',
  styleUrl: './rbac.component.css',
})
export class RbacComponent {
  private rbacService = inject(RbacService);

  // State
  staffList = computed(() => this.rbacService.staffList());
  permissions = computed(() => this.rbacService.permissions());

  // Filter States
  isFilteredActive = signal<boolean>(false);
  selectedRoleFilter = signal<string>('ALL'); // Filter Role State
  searchQuery = signal<string>('');

  // Pagination State
  currentPage = signal<number>(1);
  pageSize = signal<number>(5);

  // Modal State
  isDetailModalOpen = signal<boolean>(false);
  selectedStaff = signal<UserStaffEntity | null>(null);

  // Temporary State untuk checklist dalam modal
  tempPermissions = signal<number[]>([]);
  hasUnsavedChanges = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  showSuccessToast = signal<boolean>(false);

  // Computed: Filtering Data Staf (Search + Filter Active + Filter Role)
  filteredStaff = computed<UserStaffEntity[]>(() => {
    let list = this.staffList();

    // 1. Filter Active Only
    if (this.isFilteredActive()) {
      list = list.filter((s) => s.status === 'ACTIVE');
    }

    // 2. Filter Role / User Type
    const role = this.selectedRoleFilter();
    if (role !== 'ALL') {
      list = list.filter((s) => s.user_type === role);
    }

    // 3. Filter Search Query
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(
        (s) =>
          s.full_name.toLowerCase().includes(query) ||
          s.username.toLowerCase().includes(query) ||
          s.employee_no.toLowerCase().includes(query),
      );
    }

    return list;
  });

  // Computed: Paginated Data Staf
  paginatedStaff = computed<UserStaffEntity[]>(() => {
    const list = this.filteredStaff();
    const start = (this.currentPage() - 1) * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  // Computed: Total Halaman Pagination
  totalPages = computed<number>(() => {
    return Math.ceil(this.filteredStaff().length / this.pageSize()) || 1;
  });

  // Grouping Modul Permission
  modules = computed(() => {
    const mods = this.permissions().map((p) => p.module);
    return [...new Set(mods)];
  });

  getPermissionsByModule(moduleName: string): PermissionEntity[] {
    return this.permissions().filter((p) => p.module === moduleName);
  }

  // --- HANDLERS TOOLBAR & PAGINATION ---

  toggleFilter() {
    this.isFilteredActive.update((val) => !val);
    this.currentPage.set(1);
  }

  onRoleFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedRoleFilter.set(value);
    this.currentPage.set(1); // Reset ke halaman 1 saat filter role berubah
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // --- HANDLERS MODAL & PERMISSION ---

  openDetailModal(staff: UserStaffEntity) {
    this.selectedStaff.set(staff);
    this.tempPermissions.set([...staff.assigned_permissions]);
    this.hasUnsavedChanges.set(false);
    this.isDetailModalOpen.set(true);
  }

  closeModal() {
    this.isDetailModalOpen.set(false);
    this.selectedStaff.set(null);
    this.hasUnsavedChanges.set(false);
  }

  togglePermission(permId: number) {
    const current = this.tempPermissions();
    if (current.includes(permId)) {
      this.tempPermissions.set(current.filter((id) => id !== permId));
    } else {
      this.tempPermissions.set([...current, permId]);
    }
    this.hasUnsavedChanges.set(true);
  }

  hasPermission(permId: number): boolean {
    return this.tempPermissions().includes(permId);
  }

  applyDefaultRolePreset() {
    const staff = this.selectedStaff();
    if (!staff) return;

    const defaultIds = this.rbacService.getDefaultPermissionsByRole(staff.user_type);
    this.tempPermissions.set([...defaultIds]);
    this.hasUnsavedChanges.set(true);
  }

  saveStaffPermissions() {
    const staff = this.selectedStaff();
    if (!staff) return;

    this.isSaving.set(true);

    setTimeout(() => {
      this.rbacService.updateStaffPermissions(staff.id, this.tempPermissions());
      this.isSaving.set(false);
      this.hasUnsavedChanges.set(false);
      this.closeModal();

      // Toast Notification
      this.showSuccessToast.set(true);
      setTimeout(() => this.showSuccessToast.set(false), 3000);
    }, 600);
  }
}
