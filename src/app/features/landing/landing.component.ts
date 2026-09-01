import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink], // <-- Wajib ada CommonModule dan RouterLink
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  plafonds = [
    { amount: 'Rp 5.000.000', label: 'Pinjaman Mikro', tenor: '3 Bulan', popular: false },
    { amount: 'Rp 15.000.000', label: 'Pinjaman Regular', tenor: '6 Bulan', popular: true },
    { amount: 'Rp 50.000.000', label: 'Pinjaman Premium', tenor: '12 Bulan', popular: false },
  ];

  features = [
    {
      icon: 'bolt',
      title: 'Cepat & Mudah',
      description: 'Proses pengajuan online tanpa jaminan fisik yang rumit.',
    },
    {
      icon: 'verified_user',
      title: 'Aman & Terpercaya',
      description: 'Diawasi dan dilindungi dengan sistem keamanan berstandar tinggi.',
    },
    {
      icon: 'percent',
      title: 'Bunga Rendah',
      description: 'Nikmati cicilan ringan dengan suku bunga yang transparan.',
    },
  ];
}
