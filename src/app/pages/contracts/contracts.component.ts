import { HttpParams } from '@angular/common/http';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { ContractsService } from './services/contracts.service';
import { Observable } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { FileModalComponent } from '../../shared/components/file-modal/file-modal.component';
import { NzUploadFile } from 'ng-zorro-antd/upload';

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
export class ContractsComponent {
  public platformId = inject(PLATFORM_ID);
  public isBrowser = signal(false);
  public isModalVisible = signal(false);
  public modalData = signal<NzUploadFile>(<NzUploadFile>{});
  public analysis = signal('');
  public tabSelected = signal(1);

  private contractsService = inject(ContractsService);

  constructor() {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
  }

  public listOfAnalyses = signal<any[]>([]);
  public isLoading = signal(true);
  public pageSize = signal(10);
  public pageIndex = signal(1);
  public total = signal(0);
  public searchTerm = signal('');

  ngOnInit(): void {
    this.loadDataFromServer(
      this.searchTerm(),
      this.pageIndex(),
      this.pageSize(),
      null,
      null
    );
  }

  public loadDataFromServer(
    searchTerm: string,
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null
  ): void {
    this.isLoading.set(true);
    this.listAnalyses(searchTerm, pageIndex, pageSize, sortField, sortOrder)
      .subscribe({
        next: (data: any) => {
          this.total.set(data.count); // mock the total data here
          this.listOfAnalyses.set(data.data);
        },
        error: () => {
          this.listOfAnalyses.set([]);
        },
      })
      .add(() => this.isLoading.set(false));
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
  ): Observable<any> {
    let criteria = new HttpParams()
      .append('q', `${searchTerm}`)
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`);

    if (sortField && sortOrder) {
      criteria = criteria.append('sortField', `${sortField}`);
      criteria = criteria.append('sortOrder', `${sortOrder}`);
    }

    return this.contractsService.listAnalyses(
      '68ae6e8ea1f79ec8f2bcede6',
      criteria
    );
  }

  private listAnalysisById(id: string): void {
    this.contractsService.listAnalysisById(id).subscribe({
      next: (data) => {
        this.modalData.set({
          uid: data.data._id,
          name: data.data.titleFile,
          status: 'done',
          response: { content: data.data.originalFile },
        });
        this.analysis.set(data.data.processedFile);
        this.isModalVisible.set(true);
      },
      error: () => {
        // Handle error
      },
    });
  }

  private removeAnalysis(id: string): void {
    this.contractsService.removeAnalysis(id).subscribe({
      next: () => {
        this.loadDataFromServer(
          this.searchTerm(),
          this.pageIndex(),
          this.pageSize(),
          null,
          null
        );
      },
      error: () => {
        // Handle error
      },
    });
  }
}
