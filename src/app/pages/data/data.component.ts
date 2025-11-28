import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { UsageChartComponent } from './components/usage-chart/usage-chart.component';
import { UsageService } from './services/usage.service';
import { Subscription } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { UtilsService } from '../../shared/services/utils.service';

@Component({
  selector: 'app-data',
  imports: [UsageChartComponent],
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss',
})
export class DataComponent implements OnInit, OnDestroy {
  private usageService = inject(UsageService);
  private subscriptions = new Subscription();

  public utilsService = inject(UtilsService);

  public startDate = signal('2025-10-21');
  public endDate = signal('2025-11-28');

  public usage = signal<any[]>([]);

  private getUsageData(): void {
    const criteria = new HttpParams()
      .append('startDate', `${this.startDate()}`)
      .append('endDate', `${this.endDate()}`);

    this.subscriptions.add(
      this.usageService.getUsageByDate(criteria).subscribe((data) => {
        this.usage.set(data);
        console.log('Usage data:', data);
      })
    );
  }

  public ngOnInit(): void {
    this.getUsageData();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
