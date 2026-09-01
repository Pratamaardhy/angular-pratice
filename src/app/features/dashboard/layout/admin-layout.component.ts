import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="bg-[#f8f9ff] text-[#0b1c30] font-sans min-h-screen flex antialiased w-full">
      <!-- SideNavBar -->
      <nav
        class="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-white border-r border-gray-200 z-50 shadow-sm"
      >
        <div class="p-6 border-b border-gray-200 bg-gray-50">
          <h1 class="text-xl font-bold text-[#00236f]">Latihan Angular</h1>
          <p class="text-xs text-gray-500 mt-1">Enterprise Admin</p>
        </div>

        <div class="flex-1 overflow-y-auto py-4">
          <ul class="space-y-2 px-3">
            <li>
              <a
                routerLink="/dashboard"
                routerLinkActive="text-[#00236f] font-bold border-r-4 border-[#00236f] bg-blue-50"
                [routerLinkActiveOptions]="{ exact: true }"
                class="flex items-center px-4 py-2.5 rounded-lg text-gray-600 hover:text-[#00236f] text-sm transition-colors duration-200 hover:bg-gray-100"
              >
                <span class="material-symbols-outlined fill mr-3 text-[20px]">dashboard</span>
                Dashboard
              </a>
            </li>
            <li>
              <a
                routerLink="/pengajuan-pinjaman"
                routerLinkActive="text-[#00236f] font-bold border-r-4 border-[#00236f] bg-blue-50"
                class="flex items-center px-4 py-2.5 rounded-lg text-gray-600 hover:text-[#00236f] text-sm transition-colors duration-200 hover:bg-gray-100"
              >
                <span class="material-symbols-outlined mr-3 text-[20px]">request_quote</span>
                Pengajuan Pinjaman
              </a>
            </li>
            <li>
              <a
                routerLink="/users"
                class="flex items-center px-4 py-2.5 rounded-lg text-gray-600 hover:text-[#00236f] text-sm transition-colors duration-200 hover:bg-gray-100"
              >
                <span class="material-symbols-outlined mr-3 text-[20px]">group</span>
                Laihan
              </a>
            </li>
            <li>
              <a
                routerLink="/pengguna"
                class="flex items-center px-4 py-2.5 rounded-lg text-gray-600 hover:text-[#00236f] text-sm transition-colors duration-200 hover:bg-gray-100"
              >
                <span class="material-symbols-outlined mr-3 text-[20px]">group</span>
                pengguna
              </a>
            </li>
            <li>
              <a
                routerLink="/rbac"
                class="flex items-center px-4 py-2.5 rounded-lg text-gray-600 hover:text-[#00236f] text-sm transition-colors duration-200 hover:bg-gray-100"
              >
                <span class="material-symbols-outlined mr-3 text-[20px]">security</span>
                Setting Pengguna
              </a>
            </li>
            <li>
              <a
                routerLink="/marketing"
                routerLinkActive="text-[#00236f] font-bold border-r-4 border-[#00236f] bg-blue-50"
                class="flex items-center px-4 py-2.5 rounded-lg text-gray-600 hover:text-[#00236f] text-sm transition-colors duration-200 hover:bg-gray-100"
              >
                <span class="material-symbols-outlined mr-3 text-[20px]">rate_review</span>
                Review Marketing
              </a>
            </li>
            <li>
              <a
                routerLink="/bm-approval"
                routerLinkActive="text-[#00236f] font-bold border-r-4 border-[#00236f] bg-blue-50"
                class="flex items-center px-4 py-2.5 rounded-lg text-gray-600 hover:text-[#00236f] text-sm transition-colors duration-200 hover:bg-gray-100"
              >
                <span class="material-symbols-outlined mr-3 text-[20px]">rate_review</span>
                Review BM
              </a>
            </li>
            <li>
              <a
                routerLink="/back-office"
                routerLinkActive="text-[#00236f] font-bold border-r-4 border-[#00236f] bg-blue-50"
                class="flex items-center px-4 py-2.5 rounded-lg text-gray-600 hover:text-[#00236f] text-sm transition-colors duration-200 hover:bg-gray-100"
              >
                <span class="material-symbols-outlined mr-3 text-[20px]">rate_review</span>
                Review Back Office
              </a>
            </li>
          </ul>
        </div>

        <div class="p-4 mt-auto border-t border-gray-200">
          <a
            routerLink="/"
            class="block text-center w-full bg-[#00236f] text-white text-xs font-medium py-3 rounded-lg hover:bg-[#00236f]/90 transition-colors shadow-sm"
          >
            Kembali ke Landing
          </a>
        </div>
      </nav>

      <!-- Main Content Wrapper -->
      <div class="flex-1 w-full md:ml-64 flex flex-col min-h-screen">
        <!-- TopNavBar -->
        <header
          class="h-16 fixed top-0 right-0 flex justify-between items-center w-full md:w-[calc(100%-16rem)] px-8 border-b border-gray-200 z-40 bg-white/80 backdrop-blur-md shadow-sm"
        >
          <div class="flex items-center flex-1">
            <div class="relative w-64 hidden sm:block">
              <span
                class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]"
                >search</span
              >
              <input
                class="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00236f] text-gray-800 placeholder:text-gray-400"
                placeholder="Search..."
                type="text"
              />
            </div>
          </div>

          <!-- Logo Profil -->
          <div class="flex items-center gap-6">
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
        <main class="flex-1 pt-24 px-6 md:px-10 pb-10 bg-[#f8f9ff]">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class AdminLayoutComponent {}
