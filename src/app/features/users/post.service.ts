import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface sesuai dengan response JSONPlaceholder
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);
  private baseUrl = 'https://jsonplaceholder.typicode.com/posts';

  // Get List Data
  getList(): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseUrl);
  }

  // Get Detail Data by ID
  getDetail(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/${id}`);
  }
}
