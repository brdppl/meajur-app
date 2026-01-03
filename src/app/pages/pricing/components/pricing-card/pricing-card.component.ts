import { CurrencyPipe } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnDestroy,
  signal,
} from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { PricingEnum } from '../../../../shared/models/pricing.enum';
import { freeBenefits } from '../../../../shared/models/benefits.constant';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ionHelpBuoyOutline, ionSparklesOutline } from '@ng-icons/ionicons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { UserDataService } from '../../../../shared/services/user-data.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../../../shared/services/user.service';
import { IUser } from '../../../../shared/models/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pricing-card',
  imports: [NzCardModule, NzButtonModule, CurrencyPipe, NzIconModule, NgIcon],
  templateUrl: './pricing-card.component.html',
  styleUrl: './pricing-card.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  viewProviders: [provideIcons({ ionSparklesOutline, ionHelpBuoyOutline })],
})
export class PricingCardComponent implements OnDestroy {
  @Input() title = 'Free';
  @Input() subtitle = 'Experimente alguns recursos de forma gratuita';
  @Input() cost = PricingEnum.FREE;
  @Input() benefits = [...freeBenefits];

  public isLoading = signal(false);

  private readonly userDataService = inject(UserDataService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private subscription = new Subscription();

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public isCurrentPlan(planName: string): boolean {
    return planName === this.userDataService.getUserData()?.plan.name;
  }

  public onChangePlan(title: string): void {
    this.isLoading.set(true);
    const payload = <Pick<IUser, 'plan'>>{
      plan: {
        name: title,
      },
    };

    this.subscription.add(
      this.userService
        .changePlan(payload)
        .subscribe({
          next: (response) => {
            console.log('Plan changed successfully', response);
            this.router.navigateByUrl('/');
          },
          error: (error) => {
            console.error('Error changing plan', error);
          },
        })
        .add(() => {
          this.isLoading.set(false);
        })
    );
  }
}
