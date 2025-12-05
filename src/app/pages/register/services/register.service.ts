import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IRegister } from '../models/register.interface';
import { IResponse } from '../../../shared/models/response.interface';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private http = inject(HttpClient);

  public register(payload: IRegister): Observable<IResponse> {
    return this.http.post<IResponse>(
      `${environment.apiUrl}/users/register`,
      payload
    );
  }
}
