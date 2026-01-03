import { Component, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { PricingCardComponent } from './components/pricing-card/pricing-card.component';
import { PricingEnum } from '../../shared/models/pricing.enum';
import {
  basicBenefits,
  plusBenefits,
  proBenefits,
} from '../../shared/models/benefits.constant';

@Component({
  selector: 'app-pricing',
  imports: [NzLayoutModule, NzButtonModule, NzIconModule, PricingCardComponent],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
})
export class PricingComponent {
  private router = inject(Router);

  public pricingEnum = PricingEnum;

  public readonly basicBenefits = basicBenefits;
  public readonly plusBenefits = plusBenefits;
  public readonly proBenefits = proBenefits;

  public handleClose(): void {
    this.router.navigateByUrl('/');
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscPressed(_: Event) {
    this.handleClose();
  }
}
