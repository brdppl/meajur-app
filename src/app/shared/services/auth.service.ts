import { UserDataService } from './user-data.service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { IResponse } from '../models/response.interface';

const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private userDataService = inject(UserDataService);
  private storage = inject(LocalStorageService);

  // Salva o token no localStorage
  public setToken(token: string): void {
    this.storage.store(TOKEN_KEY, token);
  }

  // Recupera o token do localStorage
  public getToken(): string | null {
    return this.storage.retrieve(TOKEN_KEY);
  }

  // Remove o token (logout)
  public clearToken(): void {
    this.storage.clear(TOKEN_KEY);
  }

  // Verifica se está autenticado
  public isAuthenticated(): boolean {
    this.validateToken();
    return !!this.getToken();
  }

  public logout(): void {
    this.clearToken();
    this.userDataService.clearUserId();
    this.userDataService.clearUserData();
    this.router.navigateByUrl('/login');
  }

  private validateToken() {
    const token = this.getToken() ?? '';
    this.http
      .post<IResponse>(`${environment.apiUrl}/auth/validate-token`, { token })
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          console.log('Token válido:', response);
          if (!response.data) {
            this.logout();
          }
        },
        error: (error) => {
          console.error('Token inválido ou erro na validação:', error);
          this.logout();
        },
      });
  }
}
