import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContractsService {
  private http = inject(HttpClient);

  public listAnalyses(userId: string, criteria: any): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/analyses/list-by-user/${userId}`,
      { params: criteria }
    );
  }

  public listAnalysisById(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/analyses/list-by-id/${id}`);
  }

  public removeAnalysis(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/analyses/remove/${id}`);
  }
}
