import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { UsageChartComponent } from './components/usage-chart/usage-chart.component';
import { UsageService } from './services/usage.service';
import { Subscription } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { FormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { differenceInCalendarDays, format, subDays } from 'date-fns';
import { ActivatedRoute, Router } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-data',
  imports: [
    UsageChartComponent,
    NzFlexModule,
    NzDatePickerModule,
    FormsModule,
    NzSpinModule,
  ],
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss',
})
export class DataComponent implements OnInit, OnDestroy {
  private usageService = inject(UsageService);
  private subscriptions = new Subscription();
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public date: Date[] | null = null;
  public today = new Date();

  public startDate = signal(format(subDays(this.today, 7), 'yyyy-MM-dd'));
  public endDate = signal(format(this.today, 'yyyy-MM-dd'));

  public usage = signal<any[]>([]);
  public isLoading = signal(false);
  public selectedDate = signal(new Date());

  public ranges = {
    Hoje: [new Date(), new Date()],
    'Últimos 7 dias': [subDays(this.today, 7), this.today],
    'Últimos 14 dias': [subDays(this.today, 14), this.today],
    'Últimos 30 dias': [subDays(this.today, 30), this.today],
  };

  private getUsageData(): void {
    this.isLoading.set(true);
    const criteria = new HttpParams()
      .append('startDate', `${this.startDate()}`)
      .append('endDate', `${this.endDate()}`);

    this.subscriptions.add(
      this.usageService
        .getUsageByDate(criteria)
        .subscribe((response) => {
          this.usage.set(response.data);
          console.log('Usage data:', response);
        })
        .add(() => {
          this.isLoading.set(false);
        })
    );
  }

  public ngOnInit(): void {
    this.getDateFromQueryParams();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onChange(result: Date[]): void {
    const startDate = format(result[0], 'yyyy-MM-dd');
    const endDate = format(result[1], 'yyyy-MM-dd');
    this.startDate.set(startDate);
    this.endDate.set(endDate);

    this.router.navigate([], {
      queryParams: { startDate, endDate },
      queryParamsHandling: 'merge',
    });

    this.getUsageData();
    this.date = result;
  }

  public disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) > 0;
  };

  public onDateChange(event: any): void {
    this.selectedDate.set(event[0]);
  }

  private getDateFromQueryParams(): void {
    const queryParams = this.route.snapshot.queryParams as Record<
      string,
      string
    >;
    if (queryParams['startDate'] && queryParams['endDate']) {
      this.startDate.set(queryParams['startDate']);
      this.endDate.set(queryParams['endDate']);
      this.date = [
        new Date(`${queryParams['startDate']}T00:00:00`),
        new Date(`${queryParams['endDate']}T00:00:00`),
      ];
    }

    this.getUsageData();
  }
}
