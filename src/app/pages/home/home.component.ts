import { UploadService } from './../../shared/services/upload.service';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {
  NzUploadChangeParam,
  NzUploadFile,
  NzUploadModule,
  NzUploadXHRArgs,
} from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FileModalComponent } from '../../shared/components/file-modal/file-modal.component';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionSparklesOutline } from '@ng-icons/ionicons';
import { AnalyzeService } from '../../shared/services/analyze.service';
import { isPlatformBrowser } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    NzButtonModule,
    NzIconModule,
    NzUploadModule,
    NzGridModule,
    FileModalComponent,
    NzListModule,
    NzToolTipModule,
    NgIcon,
    NzSpinModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  viewProviders: [provideIcons({ ionSparklesOutline })],
})
export class HomeComponent implements OnInit {
  public fileList = signal<NzUploadFile[]>([
    // {
    //   uid: '-1',
    //   name: 'file.pdf',
    //   status: 'done',
    //   url: 'https://example.com/file.pdf',
    // },
  ]);
  public isModalVisible = signal(false);
  public modalData = signal<NzUploadFile>(<NzUploadFile>{});

  public platformId = inject(PLATFORM_ID);
  public isBrowser = signal(false);
  public isScanning = signal(false);

  private uploadService = inject(UploadService);
  private messageService = inject(NzMessageService);
  private analyzeService = inject(AnalyzeService);
  private authService = inject(AuthService);

  constructor() {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
  }

  public ngOnInit(): void {
    this.fileList.set(this.uploadService.uploadedFile());
  }

  public beforeUpload = (
    file: NzUploadFile,
    _fileList: NzUploadFile[]
  ): boolean => {
    const isLt3M = file.size! / 1024 / 1024 < 3;

    if (!isLt3M) {
      this.messageService.error('O arquivo deve ser menor que 3MB!');
    }

    return isLt3M;
  };

  public customRequest = (item: NzUploadXHRArgs) => {
    this.isScanning.set(true);

    return this.uploadService
      .scanFile(item.postFile as File, this.authService.getToken() ?? '')
      .subscribe({
        next: (response) => {
          console.log('UPLOADDDDDD', response);
          this.isScanning.set(false);
          item.onSuccess!(response.data, item.file, event);
          this.analyzeService.analyzedContract.set('');
          this.modalData.set({
            uid: item.file.uid,
            name: item.file.name,
            status: item.file.status,
            response: response.data,
          });
        },
        error: (error) => {
          this.isScanning.set(false);
          console.error('Upload failed:', error);
          item.onError!(error, item.file);
        },
      });
  };

  public handleChange(info: NzUploadChangeParam): void {
    if (!this.isScanning()) {
      this.limitFileList(info);
    }

    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.messageService.success(
        `${info.file.name} file uploaded successfully`
      );
    } else if (info.file.status === 'error') {
      this.messageService.error(`${info.file.name} file upload failed.`);
    }
  }

  public handleOpenModal(file: NzUploadFile): void {
    this.isModalVisible.set(true);
    console.log('fileeee', file);
  }

  public handleDelete(): void {
    this.clearData();
    this.messageService.success('File list cleared successfully');
  }

  public handleCloseModal(isVisible: boolean): void {
    this.isModalVisible.set(isVisible);
  }

  private limitFileList(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];

    fileList = fileList.slice(-1);
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    this.uploadService.uploadedFile.set(fileList);
    this.fileList.set(fileList);
  }

  private clearData(): void {
    this.fileList.set([]);
    this.uploadService.uploadedFile.set([]);
    this.analyzeService.analyzedContract.set('');
  }
}
