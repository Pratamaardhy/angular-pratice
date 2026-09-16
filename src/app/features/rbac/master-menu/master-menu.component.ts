import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface MenuItem {
  id: number;
  menuCode: string;
  menuName: string;
  path: string;
  icon: string;
  category: 'Utama' | 'Manajemen Pengguna' | 'Workflow Review';
  orderIndex: number;
  isActive: boolean;
}

@Component({
  selector: 'app-master-menu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6 font-['Inter']">
      <!-- Header Banner -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold text-[#00236f] tracking-tight">Master Data Menu (RBAC)</h2>
          <p class="text-xs text-slate-500 mt-1">Kelola daftar menu nav-bar, path route, dan pengelompokan menu aplikasi secara dinamis.</p>
        </div>
        <button
          type="button"
          (click)="openModal()"
          class="px-4 py-2 bg-[#00236f] hover:bg-[#001850] text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-2 self-start sm:self-auto"
        >
          <span class="material-symbols-outlined text-[18px]">add</span>
          Tambah Menu Baru
        </button>
      </div>

      <!-- Table Card UI -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <!-- Filter Bar -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
          <div class="relative w-full sm:w-72">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input
              type="text"
              [value]="searchQuery()"
              (input)="searchQuery.set($any($event.target).value)"
              placeholder="Cari Kode, Nama Menu, Path..."
              class="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00236f]"
            />
          </div>
          <span class="text-xs text-slate-500 font-medium">Total: {{ filteredMenus().length }} Menu Registered</span>
        </div>

        <!-- Tabel Menu -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-xs text-slate-500 border-b border-slate-200 font-semibold bg-slate-50/50">
                <th class="py-3 px-3">No</th>
                <th class="py-3 px-3">Kode Menu</th>
                <th class="py-3 px-3">Nama Menu</th>
                <th class="py-3 px-3">Path Route</th>
                <th class="py-3 px-3">Kategori</th>
                <th class="py-3 px-3">Ikon</th>
                <th class="py-3 px-3 text-center">Urutan</th>
                <th class="py-3 px-3 text-center">Status</th>
                <th class="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="text-xs text-slate-800">
              @for (menu of filteredMenus(); track menu.id; let i = $index) {
                <tr class="border-b border-slate-100 hover:bg-slate-50/60 transition">
                  <td class="py-3 px-3 font-bold text-slate-400">{{ i + 1 }}</td>
                  <td class="py-3 px-3 font-mono font-bold text-[#00236f]">{{ menu.menuCode }}</td>
                  <td class="py-3 px-3 font-bold">{{ menu.menuName }}</td>
                  <td class="py-3 px-3 font-mono text-slate-600 bg-slate-100/60 px-2 py-0.5 rounded text-[11px]">{{ menu.path }}</td>
                  <td class="py-3 px-3">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#00236f] border border-blue-100">
                      {{ menu.category }}
                    </span>
                  </td>
                  <td class="py-3 px-3">
                    <div class="flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-[18px] text-slate-700">{{ menu.icon }}</span>
                      <span class="font-mono text-[10px] text-slate-400">({{ menu.icon }})</span>
                    </div>
                  </td>
                  <td class="py-3 px-3 text-center font-bold">{{ menu.orderIndex }}</td>
                  <td class="py-3 px-3 text-center">
                    <button
                      type="button"
                      (click)="toggleStatus(menu.id)"
                      class="px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer"
                      [class.bg-emerald-50]="menu.isActive"
                      [class.text-emerald-700]="menu.isActive"
                      [class.border-emerald-200]="menu.isActive"
                      [class.bg-slate-100]="!menu.isActive"
                      [class.text-slate-500]="!menu.isActive"
                      [class.border-slate-300]="!menu.isActive"
                    >
                      {{ menu.isActive ? 'AKTIF' : 'NON-AKTIF' }}
                    </button>
                  </td>
                  <td class="py-3 px-3 text-right">
                    <div class="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        (click)="editMenu(menu)"
                        class="p-1.5 text-slate-600 hover:text-[#00236f] hover:bg-slate-100 rounded-lg"
                        title="Edit Menu"
                      >
                        <span class="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        type="button"
                        (click)="deleteMenu(menu.id)"
                        class="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg"
                        title="Hapus Menu"
                      >
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="9" class="py-8 text-center text-slate-400 italic">Data menu tidak ditemukan.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL FORM EDIT / ADD MENU -->
      @if (isModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 class="text-sm font-bold text-[#00236f] uppercase tracking-wider">
                {{ editingId() ? 'Edit Master Menu' : 'Tambah Master Menu Baru' }}
              </h3>
              <button type="button" (click)="closeModal()" class="text-slate-400 hover:text-slate-600">
                <span class="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form [formGroup]="menuForm" (ngSubmit)="saveMenu()" class="space-y-4 text-xs">
              <div>
                <label class="font-bold text-slate-700 block mb-1">Kode Menu *</label>
                <input
                  type="text"
                  formControlName="menuCode"
                  placeholder="Contoh: MENU_DASHBOARD"
                  class="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#00236f] font-mono"
                />
              </div>

              <div>
                <label class="font-bold text-slate-700 block mb-1">Nama Menu *</label>
                <input
                  type="text"
                  formControlName="menuName"
                  placeholder="Contoh: Dashboard Utama"
                  class="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#00236f]"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Path Route *</label>
                  <input
                    type="text"
                    formControlName="path"
                    placeholder="/dashboard"
                    class="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#00236f] font-mono"
                  />
                </div>
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Material Icon *</label>
                  <input
                    type="text"
                    formControlName="icon"
                    placeholder="dashboard"
                    class="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#00236f]"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Kategori Kelompok *</label>
                  <select formControlName="category" class="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#00236f]">
                    <option value="Utama">Utama</option>
                    <option value="Manajemen Pengguna">Manajemen Pengguna</option>
                    <option value="Workflow Review">Workflow Review</option>
                  </select>
                </div>
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Urutan Menu *</label>
                  <input
                    type="number"
                    formControlName="orderIndex"
                    class="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#00236f]"
                  />
                </div>
              </div>

              <div class="flex items-center gap-2 pt-2">
                <input type="checkbox" formControlName="isActive" id="isActiveCheck" class="w-4 h-4 rounded text-[#00236f]" />
                <label for="isActiveCheck" class="font-medium text-slate-700">Menu Aktif dalam Aplikasi</label>
              </div>

              <div class="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" (click)="closeModal()" class="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition">
                  Batal
                </button>
                <button type="submit" class="px-4 py-2 bg-[#00236f] text-white font-semibold rounded-xl hover:bg-[#001850] transition shadow-sm">
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class MasterMenuComponent {
  readonly searchQuery = signal('');
  readonly isModalOpen = signal(false);
  readonly editingId = signal<number | null>(null);

  readonly menuForm: FormGroup;

  readonly menus = signal<MenuItem[]>([
    { id: 1, menuCode: 'MENU_DASHBOARD', menuName: 'Dashboard', path: '/dashboard', icon: 'dashboard', category: 'Utama', orderIndex: 1, isActive: true },
    { id: 2, menuCode: 'MENU_LOAN_REQ', menuName: 'Pengajuan Pinjaman', path: '/pengajuan', icon: 'request_quote', category: 'Utama', orderIndex: 2, isActive: true },
    { id: 3, menuCode: 'MENU_USER_MGMT', menuName: 'Pengguna', path: '/pengguna', icon: 'group', category: 'Manajemen Pengguna', orderIndex: 3, isActive: true },
    { id: 4, menuCode: 'MENU_RBAC_SETTING', menuName: 'Setting Pengguna', path: '/rbac', icon: 'manage_accounts', category: 'Manajemen Pengguna', orderIndex: 4, isActive: true },
    { id: 5, menuCode: 'MENU_MKT_REVIEW', menuName: 'Review Marketing', path: '/marketing', icon: 'rate_review', category: 'Workflow Review', orderIndex: 5, isActive: true },
    { id: 6, menuCode: 'MENU_BM_REVIEW', menuName: 'Review BM', path: '/bm-approval', icon: 'account_balance_wallet', category: 'Workflow Review', orderIndex: 6, isActive: true },
    { id: 7, menuCode: 'MENU_BO_REVIEW', menuName: 'Review Back Office', path: '/back-office', icon: 'payments', category: 'Workflow Review', orderIndex: 7, isActive: true },
  ]);

  constructor(private fb: FormBuilder) {
    this.menuForm = this.fb.group({
      menuCode: ['', Validators.required],
      menuName: ['', Validators.required],
      path: ['', Validators.required],
      icon: ['dashboard', Validators.required],
      category: ['Utama', Validators.required],
      orderIndex: [1, Validators.required],
      isActive: [true],
    });
  }

  readonly filteredMenus = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.menus().filter(
      (m) =>
        m.menuCode.toLowerCase().includes(q) ||
        m.menuName.toLowerCase().includes(q) ||
        m.path.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    );
  });

  openModal(): void {
    this.editingId.set(null);
    this.menuForm.reset({ icon: 'dashboard', category: 'Utama', orderIndex: this.menus().length + 1, isActive: true });
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  editMenu(menu: MenuItem): void {
    this.editingId.set(menu.id);
    this.menuForm.patchValue(menu);
    this.isModalOpen.set(true);
  }

  saveMenu(): void {
    if (this.menuForm.invalid) {
      this.menuForm.markAllAsTouched();
      return;
    }

    const val = this.menuForm.value;
    if (this.editingId()) {
      this.menus.update((items) =>
        items.map((item) => (item.id === this.editingId() ? { ...item, ...val } : item))
      );
    } else {
      const newItem: MenuItem = { id: Date.now(), ...val };
      this.menus.update((items) => [...items, newItem]);
    }
    this.closeModal();
  }

  toggleStatus(id: number): void {
    this.menus.update((items) =>
      items.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    );
  }

  deleteMenu(id: number): void {
    if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      this.menus.update((items) => items.filter((m) => m.id !== id));
    }
  }
}