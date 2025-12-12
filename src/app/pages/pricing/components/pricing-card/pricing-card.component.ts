import { CurrencyPipe } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
} from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { PricingEnum } from '../../../../shared/models/pricing.enum';
import { freeBenefits } from '../../../../shared/models/benefits.constant';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ionHelpBuoyOutline, ionSparklesOutline } from '@ng-icons/ionicons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { UserDataService } from '../../../../shared/services/user-data.service';

@Component({
  selector: 'app-pricing-card',
  imports: [NzCardModule, NzButtonModule, CurrencyPipe, NzIconModule, NgIcon],
  templateUrl: './pricing-card.component.html',
  styleUrl: './pricing-card.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  viewProviders: [provideIcons({ ionSparklesOutline, ionHelpBuoyOutline })],
})
export class PricingCardComponent {
  @Input() title = 'Free';
  @Input() subtitle = 'Experimente alguns recursos de forma gratuíta';
  @Input() cost = PricingEnum.FREE;
  @Input() benefits = [...freeBenefits];

  private readonly userDataService = inject(UserDataService);

  public isCurrentPlan(planName: string): boolean {
    return planName === this.userDataService.getUserData()?.plan.name;
  }
}
