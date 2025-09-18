import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IRegister } from '../models/register.interface';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private http = inject(HttpClient);

  public register(payload: IRegister): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/register`, payload);
  }
}
