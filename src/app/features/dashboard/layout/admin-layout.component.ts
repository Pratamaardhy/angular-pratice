import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NotificationBellComponent } from '../../../shared/components/notification-bell/notification.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NotificationBellComponent],
  template: `
    <div
      class="bg-[#f8f9ff] text-[#0b1c30] font-sans min-h-screen flex antialiased w-full relative"
    >
      <!-- Backdrop Overlay Mobile -->
      @if (isMobileOpen()) {
        <div
          (click)="closeMobileSidebar()"
          class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
        ></div>
      }

      <!-- SideNavBar -->
      <nav
        class="flex flex-col h-screen fixed left-0 top-0 bg-white border-r border-gray-200 z-50 shadow-sm transition-all duration-300 ease-in-out overflow-x-hidden"
        [class.w-64]="!isCollapsed()"
        [class.w-20]="isCollapsed()"
        [class.translate-x-0]="isMobileOpen()"
        [class.-translate-x-full]="!isMobileOpen()"
        [class.md:translate-x-0]="true"
      >
        <!-- Brand Header -->
        <div class="p-4 border-b border-gray-100 flex items-center justify-between min-h-[65px]">
          <div class="flex items-center gap-2.5 overflow-hidden">
            <div
              class="w-9 h-9 rounded-xl bg-[#00236f] text-white flex-shrink-0 flex items-center justify-center font-bold text-lg shadow-sm"
            >
              LA
            </div>
            @if (!isCollapsed()) {
              <div class="truncate transition-opacity duration-200">
                <h1 class="text-sm font-bold text-[#00236f] leading-tight truncate">
                  Latihan Angular
                </h1>
                <p class="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                  Enterprise Admin
                </p>
              </div>
            }
          </div>

          <!-- Tombol Collapse -->
          <button
            type="button"
            (click)="toggleSidebar()"
            class="p-1.5 rounded-lg bg-blue-50 border border-blue-200 hover:bg-[#00236f] text-[#00236f] hover:text-white transition-colors flex-shrink-0 flex items-center justify-center shadow-xs cursor-pointer"
            [title]="isCollapsed() ? 'Buka Sidebar' : 'Kecilkan Sidebar'"
            [class.mx-auto]="isCollapsed()"
          >
            <span class="material-symbols-outlined text-[18px]">
              {{ isCollapsed() ? 'chevron_right' : 'chevron_left' }}
            </span>
          </button>
        </div>

        <!-- Navigation Links Grouped -->
        <div class="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          <!-- Kelompok 1: Utama -->
          <div>
            @if (!isCollapsed()) {
              <span
                class="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2"
              >
                Utama
              </span>
            }
            <ul class="space-y-1">
              <li>
                <a
                  routerLink="/dashboard"
                  routerLinkActive="!bg-[#00236f] !text-white font-semibold shadow-sm"
                  [routerLinkActiveOptions]="{ exact: true }"
                  [title]="isCollapsed() ? 'Dashboard' : ''"
                  (click)="closeMobileSidebar()"
                  class="flex items-center px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-[#00236f] hover:bg-slate-100 text-xs transition-all duration-200"
                  [class.justify-center]="isCollapsed()"
                >
                  <span
                    class="material-symbols-outlined text-[20px] flex-shrink-0"
                    [class.mr-3]="!isCollapsed()"
                    >dashboard</span
                  >
                  @if (!isCollapsed()) {
                    <span class="truncate">Dashboard</span>
                  }
                </a>
              </li>
              <li>
                <a
                  routerLink="/pengajuan"
                  routerLinkActive="!bg-[#00236f] !text-white font-semibold shadow-sm"
                  [title]="isCollapsed() ? 'Pengajuan Pinjaman' : ''"
                  (click)="closeMobileSidebar()"
                  class="flex items-center px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-[#00236f] hover:bg-slate-100 text-xs transition-all duration-200"
                  [class.justify-center]="isCollapsed()"
                >
                  <span
                    class="material-symbols-outlined text-[20px] flex-shrink-0"
                    [class.mr-3]="!isCollapsed()"
                    >request_quote</span
                  >
                  @if (!isCollapsed()) {
                    <span class="truncate">Pengajuan Pinjaman</span>
                  }
                </a>
              </li>
            </ul>
          </div>

          <!-- Kelompok 2: Manajemen Pengguna & RBAC Dinamis -->
          <div>
            @if (!isCollapsed()) {
              <span
                class="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2"
              >
                Manajemen Pengguna & RBAC
              </span>
            }
            <ul class="space-y-1">
              <li>
                <a
                  routerLink="/pengguna"
                  routerLinkActive="!bg-[#00236f] !text-white font-semibold shadow-sm"
                  [title]="isCollapsed() ? 'Master User' : ''"
                  (click)="closeMobileSidebar()"
                  class="flex items-center px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-[#00236f] hover:bg-slate-100 text-xs transition-all duration-200"
                  [class.justify-center]="isCollapsed()"
                >
                  <span
                    class="material-symbols-outlined text-[20px] flex-shrink-0"
                    [class.mr-3]="!isCollapsed()"
                    >group</span
                  >
                  @if (!isCollapsed()) {
                    <span class="truncate">Master User</span>
                  }
                </a>
              </li>
              <li>
                <a
                  routerLink="/master-menu"
                  routerLinkActive="!bg-[#00236f] !text-white font-semibold shadow-sm"
                  [title]="isCollapsed() ? 'Master Menu' : ''"
                  (click)="closeMobileSidebar()"
                  class="flex items-center px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-[#00236f] hover:bg-slate-100 text-xs transition-all duration-200"
                  [class.justify-center]="isCollapsed()"
                >
                  <span
                    class="material-symbols-outlined text-[20px] flex-shrink-0"
                    [class.mr-3]="!isCollapsed()"
                    >menu_open</span
                  >
                  @if (!isCollapsed()) {
                    <span class="truncate">Master Menu</span>
                  }
                </a>
              </li>
              <li>
                <a
                  routerLink="/master-role"
                  routerLinkActive="!bg-[#00236f] !text-white font-semibold shadow-sm"
                  [title]="isCollapsed() ? 'Master Role' : ''"
                  (click)="closeMobileSidebar()"
                  class="flex items-center px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-[#00236f] hover:bg-slate-100 text-xs transition-all duration-200"
                  [class.justify-center]="isCollapsed()"
                >
                  <span
                    class="material-symbols-outlined text-[20px] flex-shrink-0"
                    [class.mr-3]="!isCollapsed()"
                    >admin_panel_settings</span
                  >
                  @if (!isCollapsed()) {
                    <span class="truncate">Master Role</span>
                  }
                </a>
              </li>
              <li>
                <a
                  routerLink="/master-access"
                  routerLinkActive="!bg-[#00236f] !text-white font-semibold shadow-sm"
                  [title]="isCollapsed() ? 'Master Access Matrix' : ''"
                  (click)="closeMobileSidebar()"
                  class="flex items-center px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-[#00236f] hover:bg-slate-100 text-xs transition-all duration-200"
                  [class.justify-center]="isCollapsed()"
                >
                  <span
                    class="material-symbols-outlined text-[20px] flex-shrink-0"
                    [class.mr-3]="!isCollapsed()"
                    >manage_accounts</span
                  >
                  @if (!isCollapsed()) {
                    <span class="truncate">Master Access Matrix</span>
                  }
                </a>
              </li>
            </ul>
          </div>

          <!-- Kelompok 3: Konfigurasi Produk & Plafond -->
          <div>
            @if (!isCollapsed()) {
              <span
                class="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2"
              >
                Konfigurasi Produk
              </span>
            }
            <ul class="space-y-1">
              <li>
                <a
                  routerLink="/master-plafond"
                  routerLinkActive="!bg-[#00236f] !text-white font-semibold shadow-sm"
                  [title]="isCollapsed() ? 'Master Plafond' : ''"
                  (click)="closeMobileSidebar()"
                  class="flex items-center px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-[#00236f] hover:bg-slate-100 text-xs transition-all duration-200"
                  [class.justify-center]="isCollapsed()"
                >
                  <span
                    class="material-symbols-outlined text-[20px] flex-shrink-0"
                    [class.mr-3]="!isCollapsed()"
                    >price_change</span
                  >
                  @if (!isCollapsed()) {
                    <span class="truncate">Master Plafond</span>
                  }
                </a>
              </li>
            </ul>
          </div>

          <!-- Kelompok 4: Workflow Review -->
          <div>
            @if (!isCollapsed()) {
              <span
                class="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2"
              >
                Workflow Review
              </span>
            }
            <ul class="space-y-1">
              <li>
                <a
                  routerLink="/marketing"
                  routerLinkActive="!bg-[#00236f] !text-white font-semibold shadow-sm"
                  [title]="isCollapsed() ? 'Review Marketing' : ''"
                  (click)="closeMobileSidebar()"
                  class="flex items-center px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-[#00236f] hover:bg-slate-100 text-xs transition-all duration-200"
                  [class.justify-center]="isCollapsed()"
                >
                  <span
                    class="material-symbols-outlined text-[20px] flex-shrink-0"
                    [class.mr-3]="!isCollapsed()"
                    >rate_review</span
                  >
                  @if (!isCollapsed()) {
                    <span class="truncate">Review Marketing</span>
                  }
                </a>
              </li>
              <li>
                <a
                  routerLink="/bm-approval"
                  routerLinkActive="!bg-[#00236f] !text-white font-semibold shadow-sm"
                  [title]="isCollapsed() ? 'Review BM' : ''"
                  (click)="closeMobileSidebar()"
                  class="flex items-center px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-[#00236f] hover:bg-slate-100 text-xs transition-all duration-200"
                  [class.justify-center]="isCollapsed()"
                >
                  <span
                    class="material-symbols-outlined text-[20px] flex-shrink-0"
                    [class.mr-3]="!isCollapsed()"
                    >account_balance_wallet</span
                  >
                  @if (!isCollapsed()) {
                    <span class="truncate">Review BM</span>
                  }
                </a>
              </li>
              <li>
                <a
                  routerLink="/back-office"
                  routerLinkActive="!bg-[#00236f] !text-white font-semibold shadow-sm"
                  [title]="isCollapsed() ? 'Review Back Office' : ''"
                  (click)="closeMobileSidebar()"
                  class="flex items-center px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-[#00236f] hover:bg-slate-100 text-xs transition-all duration-200"
                  [class.justify-center]="isCollapsed()"
                >
                  <span
                    class="material-symbols-outlined text-[20px] flex-shrink-0"
                    [class.mr-3]="!isCollapsed()"
                    >payments</span
                  >
                  @if (!isCollapsed()) {
                    <span class="truncate">Review Back Office</span>
                  }
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Sidebar Footer Action -->
        <div class="p-3 border-t border-gray-100 bg-slate-50/50 space-y-2">
          <a
            routerLink="/"
            [title]="isCollapsed() ? 'Kembali ke Landing' : ''"
            class="flex items-center justify-center gap-2 w-full bg-[#00236f] text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-[#001850] transition-colors shadow-sm"
          >
            <span class="material-symbols-outlined text-[18px] flex-shrink-0">logout</span>
            @if (!isCollapsed()) {
              <span class="truncate">Kembali ke Landing</span>
            }
          </a>
          @if (!isCollapsed()) {
            <p class="text-[10px] text-center text-gray-400 font-mono">v1.2.0 • BCAF ITDP</p>
          }
        </div>
      </nav>

      <!-- Main Content Wrapper -->
      <div
        class="flex-1 w-full flex flex-col min-h-screen transition-all duration-300 ease-in-out"
        [class.md:ml-64]="!isCollapsed()"
        [class.md:ml-20]="isCollapsed()"
      >
        <!-- TopNavBar -->
        <header
          class="h-16 fixed top-0 right-0 flex justify-between items-center z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 shadow-sm transition-all duration-300 ease-in-out w-full"
          [class.md:w-[calc(100%-16rem)]]="!isCollapsed()"
          [class.md:w-[calc(100%-5rem)]]="isCollapsed()"
        >
          <div class="flex items-center gap-3 flex-1">
            <button
              type="button"
              (click)="toggleSidebar()"
              class="p-2 rounded-lg border border-gray-200 hover:bg-slate-100 text-slate-700 transition flex items-center justify-center cursor-pointer"
              [title]="isCollapsed() ? 'Buka Sidebar' : 'Kecilkan Sidebar'"
            >
              <span class="material-symbols-outlined text-[20px] block">
                {{ isCollapsed() ? 'menu' : 'menu_open' }}
              </span>
            </button>

            <div class="relative w-64 hidden sm:block">
              <span
                class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]"
              >
                search
              </span>
              <input
                class="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#00236f] text-gray-800 placeholder:text-gray-400"
                placeholder="Search..."
                type="text"
              />
            </div>
          </div>

          <!-- Profile & Notification Bell -->
          <div class="flex items-center gap-4">
            <app-notification-bell />

            <div class="flex items-center gap-3 cursor-pointer group">
              <div
                class="w-9 h-9 rounded-full overflow-hidden border-2 border-blue-900/20 bg-blue-50 flex items-center justify-center shadow-sm group-hover:border-[#00236f] transition-colors"
              >
                <span class="material-symbols-outlined text-[#00236f] text-[20px]">person</span>
              </div>
              <div class="hidden md:flex flex-col text-left">
                <span class="text-xs font-bold text-gray-800">Administrator</span>
                <span class="text-[10px] text-gray-500">Admin Utama</span>
              </div>
            </div>
          </div>
        </header>

        <!-- Dynamic Content Router Outlet -->
        <main class="flex-1 pt-20 px-4 md:px-8 pb-10 bg-[#f8f9ff]">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class AdminLayoutComponent {
  readonly isCollapsed = signal(false);
  readonly isMobileOpen = signal(false);

  toggleSidebar(): void {
    if (window.innerWidth < 768) {
      this.isMobileOpen.update((v) => !v);
    } else {
      this.isCollapsed.update((v) => !v);
    }
  }

  closeMobileSidebar(): void {
    if (window.innerWidth < 768) {
      this.isMobileOpen.set(false);
    }
  }
}
