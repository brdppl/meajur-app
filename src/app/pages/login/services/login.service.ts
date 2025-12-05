import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ILogin } from '../models/login.interface';
import { IResponse } from '../../../shared/models/response.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);

  public login(payload: ILogin): Observable<IResponse> {
    return this.http.post<IResponse>(
      `${environment.apiUrl}/auth/login`,
      payload
    );
  }
}
