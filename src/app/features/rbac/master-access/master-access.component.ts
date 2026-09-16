import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface MenuAccessPermission {
  menuId: number;
  menuName: string;
  category: string;
  rolesAccess: { [roleCode: string]: { canRead: boolean; canWrite: boolean; canDelete: boolean } };
}

@Component({
  selector: 'app-master-access',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 font-['Inter']">
      <!-- Header Banner -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold text-[#00236f] tracking-tight">
            Master Data Access Matrix (RBAC)
          </h2>
          <p class="text-xs text-slate-500 mt-1">
            Pemetaan matriks hak akses dinamis (Read, Write, Delete) antara Role vs Menu Aplikasi.
          </p>
        </div>
        <button
          type="button"
          (click)="saveChanges()"
          class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2 self-start sm:self-auto"
        >
          <span class="material-symbols-outlined text-[18px]">save</span>
          Simpan Matriks Akses
        </button>
      </div>

      <!-- Access Matrix Table UI -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-xs text-slate-600 border-b border-slate-200 bg-slate-50">
                <th class="py-3 px-4 w-64">Nama Menu & Kategori</th>
                @for (role of availableRoles(); track role.code) {
                  <th class="py-3 px-4 text-center border-l border-slate-200/80 min-w-[160px]">
                    <div class="font-bold text-[#00236f]">{{ role.name }}</div>
                    <span class="text-[10px] text-slate-400 font-mono">{{ role.code }}</span>
                  </th>
                }
              </tr>
            </thead>
            <tbody class="text-xs text-slate-800">
              @for (item of accessMatrix(); track item.menuId) {
                <tr class="border-b border-slate-100 hover:bg-slate-50/50 transition">
                  <td class="py-3.5 px-4">
                    <strong class="text-slate-800 block text-xs">{{ item.menuName }}</strong>
                    <span class="text-[10px] text-slate-400 block">{{ item.category }}</span>
                  </td>

                  @for (role of availableRoles(); track role.code) {
                    <td class="py-3.5 px-4 border-l border-slate-100 text-center">
                      <div class="flex items-center justify-center gap-3">
                        <label
                          class="flex items-center gap-1 cursor-pointer"
                          title="Akses Read / Melihat"
                        >
                          <input
                            type="checkbox"
                            [checked]="item.rolesAccess[role.code]?.canRead"
                            (change)="togglePermission(item.menuId, role.code, 'canRead')"
                            class="w-3.5 h-3.5 text-[#00236f] rounded"
                          />
                          <span class="text-[10px] font-mono text-slate-500">R</span>
                        </label>

                        <label
                          class="flex items-center gap-1 cursor-pointer"
                          title="Akses Write / Menambah-Ubah"
                        >
                          <input
                            type="checkbox"
                            [checked]="item.rolesAccess[role.code]?.canWrite"
                            (change)="togglePermission(item.menuId, role.code, 'canWrite')"
                            class="w-3.5 h-3.5 text-[#00236f] rounded"
                          />
                          <span class="text-[10px] font-mono text-slate-500">W</span>
                        </label>

                        <label
                          class="flex items-center gap-1 cursor-pointer"
                          title="Akses Delete / Menghapus"
                        >
                          <input
                            type="checkbox"
                            [checked]="item.rolesAccess[role.code]?.canDelete"
                            (change)="togglePermission(item.menuId, role.code, 'canDelete')"
                            class="w-3.5 h-3.5 text-[#00236f] rounded"
                          />
                          <span class="text-[10px] font-mono text-slate-500">D</span>
                        </label>
                      </div>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class MasterAccessComponent {
  readonly availableRoles = signal([
    { code: 'ROLE_SUPERADMIN', name: 'Super Admin' },
    { code: 'ROLE_MARKETING', name: 'Marketing' },
    { code: 'ROLE_BM', name: 'BM Approval' },
    { code: 'ROLE_BACKOFFICE', name: 'Back Office' },
  ]);

  readonly accessMatrix = signal<MenuAccessPermission[]>([
    {
      menuId: 1,
      menuName: 'Dashboard Utama',
      category: 'Utama',
      rolesAccess: {
        ROLE_SUPERADMIN: { canRead: true, canWrite: true, canDelete: true },
        ROLE_MARKETING: { canRead: true, canWrite: false, canDelete: false },
        ROLE_BM: { canRead: true, canWrite: false, canDelete: false },
        ROLE_BACKOFFICE: { canRead: true, canWrite: false, canDelete: false },
      },
    },
    {
      menuId: 2,
      menuName: 'Pengajuan Pinjaman',
      category: 'Utama',
      rolesAccess: {
        ROLE_SUPERADMIN: { canRead: true, canWrite: true, canDelete: true },
        ROLE_MARKETING: { canRead: true, canWrite: true, canDelete: false },
        ROLE_BM: { canRead: true, canWrite: false, canDelete: false },
        ROLE_BACKOFFICE: { canRead: true, canWrite: false, canDelete: false },
      },
    },
    {
      menuId: 3,
      menuName: 'Review Marketing',
      category: 'Workflow Review',
      rolesAccess: {
        ROLE_SUPERADMIN: { canRead: true, canWrite: true, canDelete: true },
        ROLE_MARKETING: { canRead: true, canWrite: true, canDelete: false },
        ROLE_BM: { canRead: true, canWrite: false, canDelete: false },
        ROLE_BACKOFFICE: { canRead: false, canWrite: false, canDelete: false },
      },
    },
    {
      menuId: 4,
      menuName: 'Review Back Office',
      category: 'Workflow Review',
      rolesAccess: {
        ROLE_SUPERADMIN: { canRead: true, canWrite: true, canDelete: true },
        ROLE_MARKETING: { canRead: false, canWrite: false, canDelete: false },
        ROLE_BM: { canRead: false, canWrite: false, canDelete: false },
        ROLE_BACKOFFICE: { canRead: true, canWrite: true, canDelete: false },
      },
    },
  ]);

  togglePermission(
    menuId: number,
    roleCode: string,
    type: 'canRead' | 'canWrite' | 'canDelete',
  ): void {
    this.accessMatrix.update((matrix) =>
      matrix.map((m) => {
        if (m.menuId === menuId) {
          const currentRoleAccess = m.rolesAccess[roleCode] ?? {
            canRead: false,
            canWrite: false,
            canDelete: false,
          };
          return {
            ...m,
            rolesAccess: {
              ...m.rolesAccess,
              [roleCode]: {
                ...currentRoleAccess,
                [type]: !currentRoleAccess[type],
              },
            },
          };
        }
        return m;
      }),
    );
  }

  saveChanges(): void {
    alert('Matriks hak akses dinamis berhasil diperbarui!');
  }
}
