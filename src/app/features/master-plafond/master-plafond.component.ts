import { Component, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface PlafondTierItem {
  id: number;
  productName: string;
  tierLevel: number;
  minPlafondAmount: number;
  maxPlafondAmount: number;
  interestRatePercentage: number;
  maxTenorMonths: number;
  isActive: boolean;
}

@Component({
  selector: 'app-master-plafond',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule],
  template: `
    <div class="space-y-6 font-['Inter']">
      <!-- Header Banner -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold text-[#00236f] tracking-tight">
            Master Data Plafond & Tier Limit
          </h2>
          <p class="text-xs text-slate-500 mt-1">
            Pengaturan batas atas plafond pinjaman, suku bunga per tier, dan batasan tenor tenor
            bulanan.
          </p>
        </div>
        <button
          type="button"
          (click)="openModal()"
          class="px-4 py-2 bg-[#00236f] hover:bg-[#001850] text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-2 self-start sm:self-auto"
        >
          <span class="material-symbols-outlined text-[18px]">add</span>
          Tambah Tier Plafond
        </button>
      </div>

      <!-- Table Card UI -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="text-xs text-slate-500 border-b border-slate-200 font-semibold bg-slate-50"
              >
                <th class="py-3 px-3">Produk</th>
                <th class="py-3 px-3">Level Tier</th>
                <th class="py-3 px-3">Rentang Plafond Min - Max</th>
                <th class="py-3 px-3">Suku Bunga (%)</th>
                <th class="py-3 px-3">Max Tenor</th>
                <th class="py-3 px-3 text-center">Status</th>
                <th class="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="text-xs text-slate-800">
              @for (tier of plafonds(); track tier.id) {
                <tr class="border-b border-slate-100 hover:bg-slate-50/60 transition">
                  <td class="py-3 px-3 font-bold text-[#00236f]">{{ tier.productName }}</td>
                  <td class="py-3 px-3">
                    <span
                      class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200"
                    >
                      Tier {{ tier.tierLevel }}
                    </span>
                  </td>
                  <td class="py-3 px-3 font-semibold text-emerald-700">
                    {{ tier.minPlafondAmount | currency: 'IDR' : 'symbol' : '1.0-0' }} —
                    {{ tier.maxPlafondAmount | currency: 'IDR' : 'symbol' : '1.0-0' }}
                  </td>
                  <td class="py-3 px-3 font-bold text-slate-700">
                    {{ tier.interestRatePercentage }}% / Tahun
                  </td>
                  <td class="py-3 px-3 font-medium">{{ tier.maxTenorMonths }} Bulan</td>
                  <td class="py-3 px-3 text-center">
                    <span
                      class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      AKTIF
                    </span>
                  </td>
                  <td class="py-3 px-3 text-right">
                    <button
                      type="button"
                      (click)="editPlafond(tier)"
                      class="p-1.5 text-slate-600 hover:text-[#00236f] hover:bg-slate-100 rounded-lg"
                      title="Edit Tier"
                    >
                      <span class="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL EDIT / ADD PLAFOND -->
      @if (isModalOpen()) {
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
        >
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 class="text-sm font-bold text-[#00236f] uppercase tracking-wider">
                {{ editingId() ? 'Edit Master Plafond' : 'Tambah Tier Plafond Baru' }}
              </h3>
              <button
                type="button"
                (click)="closeModal()"
                class="text-slate-400 hover:text-slate-600"
              >
                <span class="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form [formGroup]="plafondForm" (ngSubmit)="savePlafond()" class="space-y-4 text-xs">
              <div>
                <label class="font-bold text-slate-700 block mb-1">Nama Produk *</label>
                <input
                  type="text"
                  formControlName="productName"
                  class="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#00236f]"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Tier Level *</label>
                  <input
                    type="number"
                    formControlName="tierLevel"
                    class="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#00236f]"
                  />
                </div>
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Suku Bunga (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    formControlName="interestRatePercentage"
                    class="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#00236f]"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Min Plafond (Rp) *</label>
                  <input
                    type="number"
                    formControlName="minPlafondAmount"
                    class="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#00236f]"
                  />
                </div>
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Max Plafond (Rp) *</label>
                  <input
                    type="number"
                    formControlName="maxPlafondAmount"
                    class="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#00236f]"
                  />
                </div>
              </div>

              <div>
                <label class="font-bold text-slate-700 block mb-1">Maksimal Tenor (Bulan) *</label>
                <input
                  type="number"
                  formControlName="maxTenorMonths"
                  class="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#00236f]"
                />
              </div>

              <div class="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  (click)="closeModal()"
                  class="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-[#00236f] text-white font-semibold rounded-xl hover:bg-[#001850] transition shadow-sm"
                >
                  Simpan Plafond
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class MasterPlafondComponent {
  readonly isModalOpen = signal(false);
  readonly editingId = signal<number | null>(null);

  readonly plafondForm: FormGroup;

  readonly plafonds = signal<PlafondTierItem[]>([
    {
      id: 1,
      productName: 'Silver Multiguna',
      tierLevel: 1,
      minPlafondAmount: 10000000,
      maxPlafondAmount: 50000000,
      interestRatePercentage: 8.5,
      maxTenorMonths: 12,
      isActive: true,
    },
    {
      id: 2,
      productName: 'Silver Multiguna',
      tierLevel: 2,
      minPlafondAmount: 50000000,
      maxPlafondAmount: 100000000,
      interestRatePercentage: 9.0,
      maxTenorMonths: 24,
      isActive: true,
    },
    {
      id: 3,
      productName: 'Silver Multiguna',
      tierLevel: 3,
      minPlafondAmount: 100000000,
      maxPlafondAmount: 150000000,
      interestRatePercentage: 9.5,
      maxTenorMonths: 36,
      isActive: true,
    },
  ]);

  constructor(private fb: FormBuilder) {
    this.plafondForm = this.fb.group({
      productName: ['', Validators.required],
      tierLevel: [1, Validators.required],
      minPlafondAmount: [10000000, Validators.required],
      maxPlafondAmount: [50000000, Validators.required],
      interestRatePercentage: [8.5, Validators.required],
      maxTenorMonths: [12, Validators.required],
    });
  }

  openModal(): void {
    this.editingId.set(null);
    this.plafondForm.reset({
      productName: 'Silver Multiguna',
      tierLevel: 1,
      minPlafondAmount: 10000000,
      maxPlafondAmount: 50000000,
      interestRatePercentage: 8.5,
      maxTenorMonths: 12,
    });
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  editPlafond(tier: PlafondTierItem): void {
    this.editingId.set(tier.id);
    this.plafondForm.patchValue(tier);
    this.isModalOpen.set(true);
  }

  savePlafond(): void {
    if (this.plafondForm.invalid) {
      this.plafondForm.markAllAsTouched();
      return;
    }

    const val = this.plafondForm.value;
    if (this.editingId()) {
      this.plafonds.update((items) =>
        items.map((t) => (t.id === this.editingId() ? { ...t, ...val } : t)),
      );
    } else {
      const newItem: PlafondTierItem = { id: Date.now(), isActive: true, ...val };
      this.plafonds.update((items) => [...items, newItem]);
    }
    this.closeModal();
  }
}
