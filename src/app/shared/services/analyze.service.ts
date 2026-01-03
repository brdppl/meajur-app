import { UserDataService } from './user-data.service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { IAnalysis } from '../models/analysis.interface';
import { environment } from '../../../environments/environment';
import { IResponse } from '../models/response.interface';

@Injectable({
  providedIn: 'root',
})
export class AnalyzeService {
  public analyzedContract = signal('');

  private userDataService = inject(UserDataService);
  private http = inject(HttpClient);

  public analyzeContract(
    rawText: string,
    token: string
  ): Observable<IResponse> {
    return this.http.post<IResponse>(
      `${environment.apiUrl}/analyses/analyze-file`,
      {
        segment: 'Microempreendedor',
        text: rawText,
        userId: this.userDataService.getUserId(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  public saveAnalysis(
    payload: IAnalysis,
    token: string
  ): Observable<IResponse> {
    return this.http.post<IResponse>(
      `${environment.apiUrl}/analyses/save`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
