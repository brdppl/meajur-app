import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { featherSidebar } from '@ng-icons/feather-icons';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { ConfigModalComponent } from './shared/components/config-modal/config-modal.component';
import { NotificationsDrawerComponent } from './shared/components/notifications-drawer/notifications-drawer.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NzBreadCrumbModule,
    NzLayoutModule,
    NzIconModule,
    NzMenuModule,
    NzButtonModule,
    NzBadgeModule,
    NgIcon,
    NzToolTipModule,
    NzAvatarModule,
    NzDropDownModule,
    RouterModule,
    ConfigModalComponent,
    NotificationsDrawerComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  viewProviders: [provideIcons({ featherSidebar })],
})
export class AppComponent {
  public platformId = inject(PLATFORM_ID);

  public isCollapsed = signal(false);
  public isModalVisible = signal(false);
  public isDrawerVisible = signal(false);

  public isBrowser = signal(false);

  constructor() {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
  }

  public handleConfigModal() {
    this.isModalVisible.set(true);
  }

  public handleNotificationsDrawer() {
    this.isDrawerVisible.set(true);
  }
}
