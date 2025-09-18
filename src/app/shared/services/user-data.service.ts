import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IUser } from '../models/user.interface';
import { LocalStorageService } from 'ngx-webstorage';

const USER_DATA_KEY = 'user_data_token';
const USER_ID_KEY = 'user_id_token';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private http = inject(HttpClient);
  private storage = inject(LocalStorageService);

  public setUserId(userId: string): void {
    this.storage.store(USER_ID_KEY, userId);
  }

  public getUserId(): string | null {
    return this.storage.retrieve(USER_ID_KEY);
  }

  public clearUserId(): void {
    this.storage.clear(USER_ID_KEY);
  }

  public setUserData(userData: IUser): void {
    this.storage.store(USER_DATA_KEY, JSON.stringify(userData));
  }

  public getUserData(): IUser | null {
    const userData = this.storage.retrieve(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  public clearUserData(): void {
    this.storage.clear(USER_DATA_KEY);
  }

  public fetchUserData(token: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/${this.getUserId()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
