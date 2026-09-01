import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { tap, catchError, finalize, switchMap } from 'rxjs/operators';
import { PostService, Post } from './post.service';

@Injectable({ providedIn: 'root' })
export class PostStore {
  private postService = inject(PostService);

  // 1. Deklarasi State (BehaviorSubject)
  private dataListSubject = new BehaviorSubject<Post[]>([]);
  private detailSubject = new BehaviorSubject<Post | null>(null);

  // State tambahan: Loading dan Error
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // 2. Expose State sebagai Observable (Hanya bisa dibaca oleh Component)
  readonly dataList$ = this.dataListSubject.asObservable();
  readonly detail$ = this.detailSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  // 3. Deklarasi Action / Trigger (Subject)
  private loadListAction = new Subject<void>();
  private loadDetailAction = new Subject<number>();

  constructor() {
    // 4. RxJS Stream untuk Get List
    this.loadListAction
      .pipe(
        tap(() => {
          this.loadingSubject.next(true); // Mulai loading
          this.errorSubject.next(null); // Reset error
        }),
        // switchMap akan membatalkan request sebelumnya jika tombol di-klik berulang-ulang
        switchMap(() =>
          this.postService.getList().pipe(
            tap((data) => this.dataListSubject.next(data)), // Simpan data ke state
            catchError((err) => {
              this.errorSubject.next('Terjadi kesalahan saat memuat daftar data.');
              return of([]); // Return data kosong jika error
            }),
            finalize(() => this.loadingSubject.next(false)), // Matikan loading baik sukses/error
          ),
        ),
      )
      .subscribe();

    // 5. RxJS Stream untuk Get Detail by ID
    this.loadDetailAction
      .pipe(
        tap(() => {
          this.loadingSubject.next(true);
          this.errorSubject.next(null);
        }),
        switchMap((id) =>
          this.postService.getDetail(id).pipe(
            tap((detail) => this.detailSubject.next(detail)),
            catchError((err) => {
              this.errorSubject.next(`Gagal memuat detail untuk ID: ${id}`);
              return of(null);
            }),
            finalize(() => this.loadingSubject.next(false)),
          ),
        ),
      )
      .subscribe();
  }

  // 6. Fungsi Trigger yang dipanggil oleh Component
  loadDataList() {
    this.loadListAction.next();
  }

  loadDataDetail(id: number) {
    this.loadDetailAction.next(id);
  }
}
