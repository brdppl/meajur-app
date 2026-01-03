import { UserDataService } from './../../shared/services/user-data.service';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { UsageChartComponent } from './components/usage-chart/usage-chart.component';
import { UsageService } from './services/usage.service';
import { Subscription } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { FormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import {
  differenceInCalendarDays,
  format,
  subDays,
  minutesToHours,
} from 'date-fns';
import { ActivatedRoute, Router } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-data',
  imports: [
    UsageChartComponent,
    NzFlexModule,
    NzDatePickerModule,
    FormsModule,
    NzSpinModule,
    NzCardModule,
    NzGridModule,
  ],
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss',
})
export class DataComponent implements OnInit, OnDestroy {
  private usageService = inject(UsageService);
  private userDataService = inject(UserDataService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private subscriptions = new Subscription();

  public today = new Date();
  public date: Date[] | null = null;

  public startDate = signal(format(subDays(this.today, 7), 'yyyy-MM-dd'));
  public endDate = signal(format(this.today, 'yyyy-MM-dd'));

  public usage = signal<any[]>([]);
  public selectedDate = signal(new Date());

  public isLoading = signal(false);
  public isLoadingSavedDocuments = signal(false);
  public isLoadingUsedCredits = signal(true);
  public isLoadingTimeSaved = signal(false);

  public savedDocuments = signal(0);
  public usedCredits = signal(0);
  public timeSaved = signal(0);

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
    this.getSavedDocuments();
    this.getTimeSaved();
    this.getUsedCredits();
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

  public cardSavedDocumentsLabel(value: number): string {
    return value !== 1 ? 'Contratos salvos' : 'Contrato salvo';
  }

  public cardUsedCreditsLabel(value: number): string {
    return value !== 1
      ? 'Créditos usados neste mês'
      : 'Crédito usado neste mês';
  }

  public cardTimeSavedLabel(): string {
    const hours = String(Math.floor(this.timeSaved()) / 60).split('.')[0];
    const restOfMinutes = Math.floor(this.timeSaved()) % 60;

    return this.timeSaved() > 120
      ? `${hours}h${restOfMinutes}m`
      : `${this.timeSaved()}m`;
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

  private getSavedDocuments(): void {
    this.isLoadingSavedDocuments.set(true);
    this.subscriptions.add(
      this.usageService
        .getSavedDocuments()
        .subscribe({
          next: ({ data }) => {
            this.savedDocuments.set(data.totalDocuments);
          },
          error: (error) => {},
        })
        .add(() => {
          this.isLoadingSavedDocuments.set(false);
        })
    );
  }

  private getTimeSaved(): void {
    this.isLoadingTimeSaved.set(true);
    this.subscriptions.add(
      this.usageService
        .getTimeSaved()
        .subscribe({
          next: ({ data }) => {
            const minutes = Number((data.totalSavedTime / 60).toFixed(0));
            this.timeSaved.set(minutes);
          },
          error: (error) => {},
        })
        .add(() => {
          this.isLoadingTimeSaved.set(false);
        })
    );
  }

  private getUsedCredits(): void {
    const { totalCredits, credits } = this.userDataService.getUserData()?.plan!;
    const usedCredits = totalCredits - credits;
    this.usedCredits.set(usedCredits);
    this.isLoadingUsedCredits.set(false);
  }
}
