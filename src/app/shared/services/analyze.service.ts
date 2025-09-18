import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { IAnalysis } from '../models/analysis.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyzeService {
  public analyzedContract = signal('');

  private http = inject(HttpClient);

  public analyzeContract(rawText: string, token: string): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/analyses/analyze-file`,
      {
        segment: 'Microempreendedor',
        text: rawText,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  public saveAnalysis(payload: IAnalysis, token: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/analyses/save`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
