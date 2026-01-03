import { UtilsService } from './shared/services/utils.service';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
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
import { filter, Subscription } from 'rxjs';
import { AuthService } from './shared/services/auth.service';
import { UserDataService } from './shared/services/user-data.service';
import { environment } from '../environments/environment';

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
export class AppComponent implements OnInit, OnDestroy {
  protected readonly date = new Date();

  public platformId = inject(PLATFORM_ID);

  public version = signal(environment.version);
  public isCollapsed = signal(false);
  public isModalVisible = signal(false);
  public isDrawerVisible = signal(false);
  public isBrowser = signal(false);
  public isHome = signal(false);
  public isLogin = signal(false);
  public isRegister = signal(false);
  public isPricing = signal(false);

  private router = inject(Router);
  private authService = inject(AuthService);
  public userDataService = inject(UserDataService);
  public utilsService = inject(UtilsService);

  private subscriptions = new Subscription();

  constructor() {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.isHome.set(event.urlAfterRedirects === '/');
          console.log('user data', this.userDataService.getUserData());
          this.isLogin.set(event.urlAfterRedirects.startsWith('/login'));
          this.isRegister.set(event.urlAfterRedirects.startsWith('/register'));
          this.isPricing.set(event.urlAfterRedirects.startsWith('/pricing'));
          if (this.authService.getToken()) {
            this.getUserPlan();
          }
        })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public handleConfigModal() {
    this.isModalVisible.set(true);
  }

  public handleNotificationsDrawer() {
    this.isDrawerVisible.set(true);
  }

  public logout() {
    this.authService.logout();
  }

  public isExternalPage(): boolean {
    if (this.isLogin() || this.isRegister() || this.isPricing()) {
      return true;
    }

    return false;
  }

  public showUserName(): string {
    if (this.userDataService.getUserData()?.name) {
      return `${this.userDataService.getUserData()?.name} ${
        this.userDataService.getUserData()?.lastName
      }`;
    }

    return this.userDataService.getUserData()?.email!;
  }

  private getUserPlan(): void {
    this.subscriptions.add(
      this.userDataService
        .fetchUserPlan(this.authService.getToken() ?? '')
        .subscribe({
          next: ({ data }) => {
            this.userDataService.setUserData({
              ...this.userDataService.getUserData()!,
              plan: data.plan,
            });
          },
        })
    );
  }
}
