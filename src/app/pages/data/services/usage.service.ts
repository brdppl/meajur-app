import { UserDataService } from './../../../shared/services/user-data.service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../environments/environment.development';
import { AuthService } from '../../../shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsageService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);

  public getUsageByDate(criteria: any): Observable<any> {
    return this.http.get(
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
}
