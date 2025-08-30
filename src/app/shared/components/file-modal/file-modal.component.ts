import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionSparkles } from '@ng-icons/ionicons';
import { AnalyzeService } from '../../services/analyze.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { SanitizePipe } from '../../pipes/sanitize.pipe';
import { UploadService } from '../../services/upload.service';
import { IAnalysis } from '../../models/analysis.interface';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-file-modal',
  imports: [
    NzButtonModule,
    NzModalModule,
    NgIcon,
    NzSpinModule,
    NzTabsModule,
    SanitizePipe,
  ],
  templateUrl: './file-modal.component.html',
  styleUrl: './file-modal.component.scss',
  viewProviders: [provideIcons({ ionSparkles })],
})
export class FileModalComponent implements OnChanges {
  @Input() public isVisible = false;
  @Input() public data = signal<NzUploadFile>(<NzUploadFile>{});
  @Input() public analysis = signal('');
  @Input() public tabSelected = signal(0);

  @Output() public onCloseModal = new EventEmitter<boolean>();

  public isLoading = signal(false);

  public uploadService = inject(UploadService);
  private analyzeService = inject(AnalyzeService);
  private messageService = inject(NzMessageService);
  private notificationService = inject(NzNotificationService);

  public ngOnChanges(changes: SimpleChanges): void {
    const isVisible = changes['isVisible'].currentValue;

    if (isVisible) {
      this.analysis.set(this.analyzeService.analyzedContract() ?? '');
      this.data.set(this.uploadService.uploadedFile()[0] ?? <NzUploadFile>{});

      if (this.analyzeService.analyzedContract()) {
        this.tabSelected.set(1);
      } else {
        this.tabSelected.set(0);
      }
    }
  }

  public handleOk(): void {
    this.analyzeContract(this.data().response.content ?? 'No file content');
  }

  public handleCancel(): void {
    this.onCloseModal.emit(false);
  }

  private analyzeContract(rawText: string): void {
    this.isLoading.set(true);
    this.notificationService.create(
      'info',
      'Contrato sendo analisado',
      'Seu contrato está sendo processado e vai levar poucos segundos. Se preferir, você pode navegar a vontade que avisaremos quando a análise estiver concluída.',
      {
        nzKey: 'info-analysis-loading',
        nzDuration: 0,
      }
    );
    this.analyzeService
      .analyzeContract(rawText)
      .subscribe({
        next: (response) => {
          console.log('Analysis result:', response);
          this.analysis.set(response.result);
          this.analyzeService.analyzedContract.set(response.result);
          this.tabSelected.set(1);
          this.saveAnalysis();
        },
        error: (error) => {
          console.error('Error analyzing contract:', error);
          this.messageService.error('Erro ao analisar o contrato.');
        },
      })
      .add(() => {
        this.isLoading.set(false);
        this.notificationService.remove('info-analysis-loading');
      });
  }

  private saveAnalysis(): void {
    const payload: IAnalysis = {
      userId: '68ae6e8ea1f79ec8f2bcede6',
      titleFile: this.data().name ?? 'No title',
      originalFile: this.data().response.content ?? 'No file content',
      processedFile: this.analysis() ?? 'No analysis result',
    };

    this.analyzeService.saveAnalysis(payload).subscribe({
      next: () => {
        this.notificationService.create(
          'success',
          'Sucesso',
          'Sua análise foi salva com sucesso e pode ser consultada na aba "Contratos salvos".',
          {
            nzDuration: 10000,
          }
        );
      },
      error: (error) => {
        console.error('Error saving analysis:', error);
        this.notificationService.create(
          'error',
          'Erro',
          'Erro ao salvar a análise.',
          {
            nzDuration: 0,
          }
        );
      },
    });
  }
}
