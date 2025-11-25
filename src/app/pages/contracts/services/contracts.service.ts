import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContractsService {
  private http = inject(HttpClient);

  public listAnalyses(
    userId: string,
    criteria: any,
    token: string
  ): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/analyses/list-by-user/${userId}`,
      { params: criteria, headers: { Authorization: `Bearer ${token}` } }
    );
  }

  public listAnalysisById(id: string, token: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/analyses/list-by-id/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  public removeAnalysis(id: string, token: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/analyses/remove/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
