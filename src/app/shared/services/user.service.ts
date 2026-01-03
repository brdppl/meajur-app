import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserDataService } from './user-data.service';
import { Observable } from 'rxjs';
import { IResponse } from '../models/response.interface';
import { environment } from '../../../environments/environment';
import { IUser } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);

  public changePlan(payload: Pick<IUser, 'plan'>): Observable<IResponse> {
    return this.http.put<IResponse>(
      `${environment.apiUrl}/users/${
        this.userDataService.getUserId() ?? ''
      }/change-plan`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken() ?? ''}`,
        },
      }
    );
  }
}
