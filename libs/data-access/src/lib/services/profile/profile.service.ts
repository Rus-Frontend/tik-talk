import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Pageble, Profile } from '../../interfaces';
import { GlobalStoreService } from '../profile/global-store.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);
  #globalStoreService = inject(GlobalStoreService);
  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  me = signal<Profile | null>(null);

  getTestAccounts() {
    return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`);
  }

  getMe() {
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`).pipe(
      tap((res) => {
        this.me.set(res);
        this.#globalStoreService.me.set(res);
      })
    );
  }

  getAccount(id: string) {
    return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`);
  }

  getSubscribersShortList(subsAmount = 3) {
    return this.http
      .get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers/`)
      .pipe(map((res) => res.items.slice(0, subsAmount)));
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http
      .patch<Profile>(`${this.baseApiUrl}account/me`, profile)
      .pipe(tap((res) => this.me.set(res)));
  }

  uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append('image', file);
    return this.http.post<Profile>(
      `${this.baseApiUrl}account/upload_image`,
      fd
    );
  }

  filterProfiles(params: Record<string, any>): Observable<Pageble<Profile>> {
    return this.http
      .get<Pageble<Profile>>(`${this.baseApiUrl}account/accounts`, {
        params,
      })
  }
}
