import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface RoleItem {
  id: number;
  roleCode: string;
  roleName: string;
  description: string;
  userCount: number;
  isSystemRole: boolean;
}

@Component({
  selector: 'app-master-role',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6 font-['Inter']">
      <!-- Header Banner -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold text-[#00236f] tracking-tight">Master Data Role (RBAC)</h2>
          <p class="text-xs text-slate-500 mt-1">Atur peran pengguna, batasan wewenang sistem, dan deskripsi tanggung jawab operasional.</p>
        </div>
        <button
          type="button"
          (click)="openModal()"
          class="px-4 py-2 bg-[#00236f] hover:bg-[#001850] text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-2 self-start sm:self-auto"
        >
          <span class="material-symbols-outlined text-[18px]">add</span>
          Tambah Role Baru
        </button>
      </div>

      <!-- Role Grid Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (role of filteredRoles(); track role.id) {
          <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:border-[#00236f]/50 transition flex flex-col justify-between space-y-4">
            <div class="space-y-2">
              <div class="flex justify-between items-start">
                <span class="px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold bg-blue-50 text-[#00236f] border border-blue-100">
                  {{ role.roleCode }}
                </span>
                @if (role.isSystemRole) {
                  <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    System Core
                  </span>
                }
              </div>
              <h3 class="text-base font-bold text-slate-800">{{ role.roleName }}</h3>
              <p class="text-xs text-slate-500 leading-relaxed">{{ role.description }}</p>
            </div>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="text-slate-400 font-medium flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">person</span>
                {{ role.userCount }} Pengguna
              </span>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  (click)="editRole(role)"
                  class="p-1.5 text-slate-600 hover:text-[#00236f] hover:bg-slate-100 rounded-lg"
                  title="Edit Role"
                >
                  <span class="material-symbols-outlined text-[18px]">edit</span>
                </button>
                @if (!role.isSystemRole) {
                  <button
                    type="button"
                    (click)="deleteRole(role.id)"
                    class="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg"
                    title="Hapus Role"
                  >
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                }
              </div>
            </div>
          </div>
        }
      </div>

      <!-- MODAL FORM EDIT / ADD ROLE -->
      @if (isModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 class="text-sm font-bold text-[#00236f] uppercase tracking-wider">
                {{ editingId() ? 'Edit Master Role' : 'Tambah Role Baru' }}
              </h3>
              <button type="button" (click)="closeModal()" class="text-slate-400 hover:text-slate-600">
                <span class="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form [formGroup]="roleForm" (ngSubmit)="saveRole()" class="space-y-4 text-xs">
              <div>
                <label class="font-bold text-slate-700 block mb-1">Kode Role *</label>
                <input
                  type="text"
                  formControlName="roleCode"
                  placeholder="Contoh: ROLE_SUPERADMIN"
                  class="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#00236f] font-mono"
                />
              </div>

              <div>
                <label class="font-bold text-slate-700 block mb-1">Nama Role *</label>
                <input
                  type="text"
                  formControlName="roleName"
                  placeholder="Contoh: Super Administrator"
                  class="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#00236f]"
                />
              </div>

              <div>
                <label class="font-bold text-slate-700 block mb-1">Deskripsi Wewenang *</label>
                <textarea
                  formControlName="description"
                  rows="3"
                  placeholder="Jelaskan peran dan tanggung jawab role ini..."
                  class="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#00236f]"
                ></textarea>
              </div>

              <div class="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" (click)="closeModal()" class="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition">
                  Batal
                </button>
                <button type="submit" class="px-4 py-2 bg-[#00236f] text-white font-semibold rounded-xl hover:bg-[#001850] transition shadow-sm">
                  Simpan Role
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class MasterRoleComponent {
  readonly isModalOpen = signal(false);
  readonly editingId = signal<number | null>(null);

  readonly roleForm: FormGroup;

  readonly roles = signal<RoleItem[]>([
    { id: 1, roleCode: 'ROLE_SUPERADMIN', roleName: 'Super Administrator', description: 'Akses penuh ke seluruh modul, konfigurasi RBAC, dan audit trail sistem.', userCount: 2, isSystemRole: true },
    { id: 2, roleCode: 'ROLE_MARKETING', roleName: 'Marketing Analyst', description: 'Bertanggung jawab melakukan review kelengkapan berkas awal pengajuan pinjaman konsumen.', userCount: 15, isSystemRole: false },
    { id: 3, roleCode: 'ROLE_BM', roleName: 'Branch Manager (BM)', description: 'Memiliki wewenang keputusann persetujuan, penolakan, atau downgrade tier pengajuan.', userCount: 8, isSystemRole: false },
    { id: 4, roleCode: 'ROLE_BACKOFFICE', roleName: 'Back Office Disbursement', description: 'Eksekusi pencairan dana, pemindahan pemindahbukuan bank target, dan verifikasi rekening.', userCount: 6, isSystemRole: false },
  ]);

  constructor(private fb: FormBuilder) {
    this.roleForm = this.fb.group({
      roleCode: ['', Validators.required],
      roleName: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  readonly filteredRoles = computed(() => this.roles());

  openModal(): void {
    this.editingId.set(null);
    this.roleForm.reset();
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  editRole(role: RoleItem): void {
    this.editingId.set(role.id);
    this.roleForm.patchValue(role);
    this.isModalOpen.set(true);
  }

  saveRole(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    const val = this.roleForm.value;
    if (this.editingId()) {
      this.roles.update((items) =>
        items.map((r) => (r.id === this.editingId() ? { ...r, ...val } : r))
      );
    } else {
      const newRole: RoleItem = { id: Date.now(), userCount: 0, isSystemRole: false, ...val };
      this.roles.update((items) => [...items, newRole]);
    }
    this.closeModal();
  }

  deleteRole(id: number): void {
    if (confirm('Apakah Anda yakin ingin menghapus role ini?')) {
      this.roles.update((items) => items.filter((r) => r.id !== id));
    }
  }
}