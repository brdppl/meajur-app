import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IResponse } from '../../../shared/models/response.interface';

@Injectable({
  providedIn: 'root',
})
export class ContractsService {
  private http = inject(HttpClient);

  public listAnalyses(
    userId: string,
    criteria: any,
    token: string
  ): Observable<IResponse> {
    return this.http.get<IResponse>(
      `${environment.apiUrl}/analyses/list-by-user/${userId}`,
      { params: criteria, headers: { Authorization: `Bearer ${token}` } }
    );
  }

  public listAnalysisById(id: string, token: string): Observable<IResponse> {
    return this.http.get<IResponse>(
      `${environment.apiUrl}/analyses/list-by-id/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  public removeAnalysis(id: string, token: string): Observable<IResponse> {
    return this.http.delete<IResponse>(
      `${environment.apiUrl}/analyses/remove/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }
}
