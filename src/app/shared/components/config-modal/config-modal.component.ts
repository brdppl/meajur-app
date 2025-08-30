import {
  Component,
  Input,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-config-modal',
  imports: [
    NzButtonModule,
    NzModalModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzTabsModule,
  ],
  templateUrl: './config-modal.component.html',
  styleUrl: './config-modal.component.scss',
})
export class ConfigModalComponent {
  @Input() public isVisible = signal(false);
  @Input() public modalTitle = signal('Geral');

  @ViewChild('generalTpl', { static: true }) generalTpl!: TemplateRef<any>;
  @ViewChild('notificationsTpl', { static: true })
  notificationsTpl!: TemplateRef<any>;
  @ViewChild('accountTpl', { static: true }) accountTpl!: TemplateRef<any>;

  public currentTpl = signal(<TemplateRef<any> | null>null);

  public handleCancel(): void {
    this.isVisible.set(false);
    this.modalTitle.set('Geral');
  }

  public changeModalTitle(title: string): void {
    this.modalTitle.set(title);
  }
}
