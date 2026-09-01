import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostStore } from './post.store';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  // Inject Store
  readonly store = inject(PostStore);

  // Mapping Stream dari Store
  dataList$ = this.store.dataList$;
  detail$ = this.store.detail$;
  loading$ = this.store.loading$;
  error$ = this.store.error$;

  isFilteredActive = signal<boolean>(false);

  ngOnInit() {
    this.store.loadDataList();
  }

  // Dipanggil saat tombol Detail di-klik
  onViewDetail(id: number) {
    this.store.loadDataDetail(id);
  }

  // Fungsi untuk menutup modal (mengatur detail stream menjadi null)
  closeModal() {
    // Memaksa reset detail di store menjadi null agar modal tertutup
    // @ts-ignore (Mengakses subject internal store untuk reset state modal)
    this.store['detailSubject'].next(null);
  }

  toggleFilter() {
    this.isFilteredActive.update((val) => !val);
  }
}
