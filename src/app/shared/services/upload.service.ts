import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IResponse } from '../models/response.interface';
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  public uploadedFile = signal<NzUploadFile[]>([]);

  private userDataService = inject(UserDataService);
  private http = inject(HttpClient);

  public scanFile(file: File, token: string): Observable<IResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', JSON.stringify(this.userDataService.getUserId()));

    return this.http.post<IResponse>(
      `${environment.apiUrl}/analyses/scan-file`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
