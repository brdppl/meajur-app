import { Component, Input, signal } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-notifications-drawer',
  imports: [
    NzButtonModule,
    NzDrawerModule,
    NzListModule,
    NzEmptyModule,
    NzIconModule,
  ],
  templateUrl: './notifications-drawer.component.html',
  styleUrl: './notifications-drawer.component.scss',
})
export class NotificationsDrawerComponent {
  @Input() public isVisible = signal(false);

  public mockList = [1, 2, 3];

  public close(): void {
    this.isVisible.set(false);
  }
}
