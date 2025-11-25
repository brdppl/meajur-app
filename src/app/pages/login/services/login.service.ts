import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ILogin } from '../models/login.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);

  public login(payload: ILogin): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, payload);
  }
}
