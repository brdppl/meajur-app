import { UserDataService } from './../../../shared/services/user-data.service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../environments/environment.development';
import { AuthService } from '../../../shared/services/auth.service';
import { IResponse } from '../../../shared/models/response.interface';

@Injectable({
  providedIn: 'root',
})
export class UsageService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);

  public getUsageByDate(criteria: any): Observable<IResponse> {
    return this.http.get<IResponse>(
      `${environment.apiUrl}/data/usage/${
        this.userDataService.getUserId() ?? ''
      }`,
      {
        params: criteria,
        headers: {
          Authorization: `Bearer ${this.authService.getToken() ?? ''}`,
        },
      }
    );
  }

  public getSavedDocuments(): Observable<IResponse> {
    return this.http.get<IResponse>(
      `${environment.apiUrl}/data/contracts/${
        this.userDataService.getUserId() ?? ''
      }`,
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken() ?? ''}`,
        },
      }
    );
  }

  public getTimeSaved(): Observable<IResponse> {
    return this.http.get<IResponse>(
      `${environment.apiUrl}/data/time-saved/${
        this.userDataService.getUserId() ?? ''
      }`,
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken() ?? ''}`,
        },
      }
    );
  }
}
