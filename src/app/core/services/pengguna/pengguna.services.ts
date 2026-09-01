import { Injectable, signal, computed } from '@angular/core';

export type UserType = 'SUPERADMIN' | 'MARKETING' | 'BRANCH_MANAGER' | 'BACKOFFICE';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED';

export interface PenggunaEntity {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  password_hash?: string;
  user_type: UserType;
  status: UserStatus;
  last_login_at?: string;
  created_at: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PenggunaService {
  // Private State (Single Source of Truth)
  private _users = signal<PenggunaEntity[]>([
    {
      id: 1,
      username: 'sultan_admin',
      email: 'admin@sultancash.id',
      phone_number: '081234567890',
      user_type: 'SUPERADMIN',
      status: 'ACTIVE',
      last_login_at: '2026-08-27 08:30',
      created_at: '2026-01-10',
    },
    {
      id: 2,
      username: 'johndoe_mkt',
      email: 'john.marketing@sultan.id',
      phone_number: '081987654321',
      user_type: 'MARKETING',
      status: 'ACTIVE',
      last_login_at: '2026-08-26 14:15',
      created_at: '2026-05-12',
    },
    {
      id: 3,
      username: 'annasmith_bm',
      email: 'anna.branch@sultan.id',
      phone_number: '085611223344',
      user_type: 'BRANCH_MANAGER',
      status: 'INACTIVE',
      last_login_at: '2026-06-01 10:00',
      created_at: '2026-06-01',
    },
    {
      id: 4,
      username: 'michael_bo',
      email: 'michael.backoffice@sultan.id',
      phone_number: '087899887766',
      user_type: 'BACKOFFICE',
      status: 'LOCKED',
      last_login_at: '2026-07-15 19:45',
      created_at: '2026-07-10',
    },
  ]);

  // Read-only public signal dengan .map() untuk transformasi data (misal: memastikan username selalu lowercase di store)
  readonly users = computed(() =>
    this._users().map((user) => ({
      ...user,
      username: user.username.toLowerCase(),
    })),
  );

  // --- ACTIONS (Store Mutators) ---

  addUser(formData: Partial<PenggunaEntity>) {
    const newUser: PenggunaEntity = {
      id: Date.now(),
      username: formData.username || '',
      email: formData.email || '',
      phone_number: formData.phone_number || '',
      password_hash: formData.password_hash || 'hashed_default',
      user_type: (formData.user_type as UserType) || 'MARKETING',
      status: (formData.status as UserStatus) || 'ACTIVE',
      created_at: new Date().toISOString().split('T')[0],
    };

    // Menggunakan .map / immutability array update
    this._users.update((currentUsers) => [newUser, ...currentUsers]);
  }

  updateUser(id: number, formData: Partial<PenggunaEntity>) {
    // Menerapkan .map() untuk memperbarui data spesifik berdasarkan ID
    this._users.update((currentUsers) =>
      currentUsers.map((u) =>
        u.id === id
          ? ({
              ...u,
              ...formData,
              updated_at: new Date().toISOString().split('T')[0],
            } as PenggunaEntity)
          : u,
      ),
    );
  }

  deleteUser(id: number) {
    // Menerapkan .map / filter untuk menghapus item
    this._users.update((currentUsers) => currentUsers.filter((u) => u.id !== id));
  }
}
