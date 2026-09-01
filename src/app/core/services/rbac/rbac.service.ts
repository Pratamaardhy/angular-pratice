import { Injectable, signal } from '@angular/core';

export type UserType = 'SUPERADMIN' | 'MARKETING' | 'BRANCH_MANAGER' | 'BACKOFFICE';

export interface PermissionEntity {
  id: number;
  permission_code: string;
  permission_name: string;
  module: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'APPROVE';
}

export interface UserStaffEntity {
  id: number; // sec_users.id
  employee_no: string; // mst_staff.employee_no
  full_name: string; // mst_staff.full_name
  username: string; // sec_users.username
  user_type: UserType; // sec_users.user_type
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
  assigned_permissions: number[]; // Array permission IDs
}

@Injectable({
  providedIn: 'root',
})
export class RbacService {
  // Master List Permission
  readonly permissions = signal<PermissionEntity[]>([
    {
      id: 101,
      permission_code: 'LOAN_CREATE',
      permission_name: 'Buat Pengajuan Pinjaman',
      module: 'Pengajuan Pinjaman',
      action: 'CREATE',
    },
    {
      id: 102,
      permission_code: 'LOAN_READ',
      permission_name: 'Lihat Daftar Pinjaman',
      module: 'Pengajuan Pinjaman',
      action: 'READ',
    },
    {
      id: 103,
      permission_code: 'LOAN_UPDATE',
      permission_name: 'Edit Data Pinjaman',
      module: 'Pengajuan Pinjaman',
      action: 'UPDATE',
    },
    {
      id: 104,
      permission_code: 'LOAN_DELETE',
      permission_name: 'Hapus/Pembatalan Pinjaman',
      module: 'Pengajuan Pinjaman',
      action: 'DELETE',
    },
    {
      id: 105,
      permission_code: 'LOAN_APPROVE_MKT',
      permission_name: 'Reviu & Approve (Marketing)',
      module: 'Pengajuan Pinjaman',
      action: 'APPROVE',
    },
    {
      id: 106,
      permission_code: 'LOAN_APPROVE_BM',
      permission_name: 'Reviu & Approve (Branch Manager)',
      module: 'Pengajuan Pinjaman',
      action: 'APPROVE',
    },

    {
      id: 201,
      permission_code: 'DISBURSE_READ',
      permission_name: 'Lihat Antrean Pencairan',
      module: 'Pencairan Dana',
      action: 'READ',
    },
    {
      id: 202,
      permission_code: 'DISBURSE_APPROVE',
      permission_name: 'Proses Pencairan (Backoffice)',
      module: 'Pencairan Dana',
      action: 'APPROVE',
    },

    {
      id: 301,
      permission_code: 'USER_MANAGE',
      permission_name: 'Kelola Data Pengguna',
      module: 'Setting Sistem',
      action: 'UPDATE',
    },
    {
      id: 302,
      permission_code: 'RBAC_MANAGE',
      permission_name: 'Kelola Hak Akses Staf',
      module: 'Setting Sistem',
      action: 'APPROVE',
    },
  ]);

  // List Account Staff
  readonly staffList = signal<UserStaffEntity[]>([
    {
      id: 1,
      employee_no: 'STF-001',
      full_name: 'Sultan Administrator',
      username: 'sultan_admin',
      user_type: 'SUPERADMIN',
      status: 'ACTIVE',
      assigned_permissions: [101, 102, 103, 104, 105, 106, 201, 202, 301, 302], // Default Super Admin
    },
    {
      id: 2,
      employee_no: 'MKT-088',
      full_name: 'John Doe Marketing',
      username: 'johndoe_mkt',
      user_type: 'MARKETING',
      status: 'ACTIVE',
      assigned_permissions: [101, 102, 103, 105], // Default Marketing Preset
    },
    {
      id: 3,
      employee_no: 'BM-012',
      full_name: 'Anna Smith Branch Mgr',
      username: 'annasmith_bm',
      user_type: 'BRANCH_MANAGER',
      status: 'ACTIVE',
      assigned_permissions: [102, 106], // Default Branch Manager Preset
    },
    {
      id: 4,
      employee_no: 'BO-005',
      full_name: 'Michael Backoffice',
      username: 'michael_bo',
      user_type: 'BACKOFFICE',
      status: 'ACTIVE',
      assigned_permissions: [102, 201, 202], // Default Backoffice Preset
    },
  ]);

  // Memberikan Preset Permission Default berdasarkan User Type / Role
  getDefaultPermissionsByRole(userType: UserType): number[] {
    switch (userType) {
      case 'SUPERADMIN':
        return [101, 102, 103, 104, 105, 106, 201, 202, 301, 302];
      case 'MARKETING':
        return [101, 102, 103, 105];
      case 'BRANCH_MANAGER':
        return [102, 106];
      case 'BACKOFFICE':
        return [102, 201, 202];
      default:
        return [102];
    }
  }

  // Action Mutator Update Hak Akses Staf
  updateStaffPermissions(staffId: number, newPermissions: number[]) {
    this.staffList.update((list) =>
      list.map((s) => (s.id === staffId ? { ...s, assigned_permissions: newPermissions } : s)),
    );
  }
}
