import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type: 'INFO' | 'WARNING' | 'SUCCESS';
}

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative font-['Inter']">
      <!-- Tombol Lonceng di TopBar -->
      <button
        type="button"
        (click)="toggleDropdown()"
        class="relative p-2 text-slate-600 hover:text-[#00236f] hover:bg-slate-100 rounded-xl transition cursor-pointer"
        title="Pusat Notifikasi"
      >
        <span class="material-symbols-outlined text-[22px]">notifications</span>
        @if (unreadCount() > 0) {
          <span class="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center border-2 border-white">
            {{ unreadCount() }}
          </span>
        }
      </button>

      <!-- DROPDOWN NOTIFIKASI POPUP -->
      @if (isOpen()) {
        <div class="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div class="px-4 py-3 bg-[#00236f] text-white flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">notifications_active</span>
              <h4 class="text-xs font-bold uppercase tracking-wider">Notifikasi Sistem</h4>
            </div>
            <button type="button" (click)="markAllAsRead()" class="text-[10px] text-blue-200 hover:text-white underline">
              Tandai Semua Dibaca
            </button>
          </div>

          <div class="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
            @for (notif of notifications(); track notif.id) {
              <div
                (click)="readNotif(notif.id)"
                class="p-3 hover:bg-slate-50 transition cursor-pointer flex gap-3"
                [class.bg-blue-50/40]="!notif.isRead"
              >
                <div class="flex-shrink-0 mt-0.5">
                  @if (notif.type === 'SUCCESS') {
                    <span class="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                  } @else if (notif.type === 'WARNING') {
                    <span class="material-symbols-outlined text-amber-600 text-[18px]">warning</span>
                  } @else {
                    <span class="material-symbols-outlined text-[#00236f] text-[18px]">info</span>
                  }
                </div>
                <div class="flex-1 space-y-0.5">
                  <div class="flex justify-between items-center">
                    <strong class="text-slate-800 text-xs font-bold" [class.text-[#00236f]]="!notif.isRead">
                      {{ notif.title }}
                    </strong>
                    <span class="text-[9px] text-slate-400">{{ notif.createdAt }}</span>
                  </div>
                  <p class="text-slate-600 text-[11px] leading-relaxed">{{ notif.message }}</p>
                </div>
              </div>
            } @empty {
              <div class="p-6 text-center text-slate-400 italic text-xs">
                Tidak ada notifikasi baru.
              </div>
            }
          </div>

          <div class="p-2.5 bg-slate-50 text-center border-t border-slate-100">
            <span class="text-[10px] text-slate-400 font-medium">BCA Finance ITDP System</span>
          </div>
        </div>
      }
    </div>
  `,
})
export class NotificationBellComponent {
  readonly isOpen = signal(false);

  readonly notifications = signal<AppNotification[]>([
    { id: 1, title: 'Pengajuan Pinjaman Baru', message: 'APP-JKT-2026-001 membutuhkan verifikasi awal Marketing.', createdAt: '10 min ago', isRead: false, type: 'INFO' },
    { id: 2, title: 'Approval BM Diperlukan', message: 'Pengajuan APP-JKT-2026-005 siap ditinjau oleh Branch Manager.', createdAt: '1 hour ago', isRead: false, type: 'WARNING' },
    { id: 3, title: 'Pencairan Dana Berhasil', message: 'Back Office sukses memproses transfer dana APP-JKT-2026-003.', createdAt: 'Yesterday', isRead: true, type: 'SUCCESS' },
  ]);

  readonly unreadCount = computed(() => this.notifications().filter((n) => !n.isRead).length);

  toggleDropdown(): void {
    this.isOpen.update((v) => !v);
  }

  readNotif(id: number): void {
    this.notifications.update((items) =>
      items.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  markAllAsRead(): void {
    this.notifications.update((items) => items.map((n) => ({ ...n, isRead: true })));
  }
}