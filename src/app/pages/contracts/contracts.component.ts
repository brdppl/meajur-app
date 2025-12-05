import { HttpParams } from '@angular/common/http';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { ContractsService } from './services/contracts.service';
import { Observable, Subscription } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { FileModalComponent } from '../../shared/components/file-modal/file-modal.component';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { UserDataService } from '../../shared/services/user-data.service';
import { AuthService } from '../../shared/services/auth.service';
import { IResponse } from '../../shared/models/response.interface';

@Component({
  selector: 'app-contracts',
  imports: [
    NzTableModule,
    NzButtonModule,
    NzDropDownModule,
    NzIconModule,
    NzPopconfirmModule,
    NzEmptyModule,
    FileModalComponent,
    DatePipe,
  ],
  templateUrl: './contracts.component.html',
  styleUrl: './contracts.component.scss',
})
export class ContractsComponent implements OnInit, OnDestroy {
  public platformId = inject(PLATFORM_ID);
  public isBrowser = signal(false);
  public isModalVisible = signal(false);
  public modalData = signal<NzUploadFile>(<NzUploadFile>{});
  public analysis = signal('');
  public tabSelected = signal(1);

  private contractsService = inject(ContractsService);
  private userDataService = inject(UserDataService);
  private authService = inject(AuthService);

  private subscriptions = new Subscription();

  constructor() {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
  }

  public listOfAnalyses = signal<any[]>([]);
  public isLoading = signal(true);
  public pageSize = signal(10);
  public pageIndex = signal(1);
  public total = signal(0);
  public searchTerm = signal('');
  public sortField = signal<string | null>(null);
  public sortOrder = signal<string | null>(null);

  public ngOnInit(): void {
    this.loadDataFromServer(
      this.searchTerm(),
      this.pageIndex(),
      this.pageSize(),
      this.sortField(),
      this.sortOrder()
    );
  }

  public ngOnDestroy(): void {}

  public loadDataFromServer(
    searchTerm: string,
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null
  ): void {
    this.isLoading.set(true);
    this.subscriptions.add(
      this.listAnalyses(searchTerm, pageIndex, pageSize, sortField, sortOrder)
        .subscribe({
          next: (response) => {
            this.total.set(response.data.count); // mock the total data here
            this.listOfAnalyses.set(response.data.data);
          },
          error: () => {
            this.listOfAnalyses.set([]);
          },
        })
        .add(() => this.isLoading.set(false))
    );
  }

  public onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadDataFromServer(
      this.searchTerm(),
      pageIndex,
      pageSize,
      sortField,
      sortOrder
    );
  }

  public handleRemove(id: string): void {
    this.removeAnalysis(id);
  }

  public handleOpen(id: string): void {
    this.listAnalysisById(id);
  }

  public handleCloseModal(isVisible: boolean): void {
    this.isModalVisible.set(isVisible);
  }

  private listAnalyses(
    searchTerm: string,
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null
  ): Observable<IResponse> {
    let criteria = new HttpParams()
      .append('q', `${searchTerm}`)
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`);

    if (sortField && sortOrder) {
      criteria = criteria.append('sortField', `${sortField}`);
      criteria = criteria.append('sortOrder', `${sortOrder}`);
    }

    this.searchTerm.set(searchTerm);
    this.pageIndex.set(pageIndex);
    this.pageSize.set(pageSize);
    this.sortField.set(sortField!);
    this.sortOrder.set(sortOrder!);

    return this.contractsService.listAnalyses(
      this.userDataService.getUserId() ?? '',
      criteria,
      this.authService.getToken() ?? ''
    );
  }

  private listAnalysisById(id: string): void {
    this.subscriptions.add(
      this.contractsService
        .listAnalysisById(id, this.authService.getToken() ?? '')
        .subscribe({
          next: (response) => {
            this.modalData.set({
              uid: response.data.data._id,
              name: response.data.data.titleFile,
              status: 'done',
              response: { content: response.data.data.originalFile },
            });
            this.analysis.set(response.data.data.processedFile);
            this.isModalVisible.set(true);
          },
          error: () => {
            // Handle error
          },
        })
    );
  }

  private removeAnalysis(id: string): void {
    this.subscriptions.add(
      this.contractsService
        .removeAnalysis(id, this.authService.getToken() ?? '')
        .subscribe({
          next: () => {
            this.loadDataFromServer(
              this.searchTerm(),
              this.pageIndex(),
              this.pageSize(),
              this.sortField(),
              this.sortOrder()
            );
          },
          error: () => {
            // Handle error
          },
        })
    );
  }
}
