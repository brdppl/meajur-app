import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BarVerticalComponent, NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-usage-chart',
  imports: [NgxChartsModule],
  templateUrl: './usage-chart.component.html',
  styleUrl: './usage-chart.component.scss',
})
export class UsageChartComponent implements OnChanges {
  @Input() usage: any[] = [];
  @Input() rangeDate = '';

  @ViewChild('usageChart') usageChart: BarVerticalComponent = <any>{};

  public view: [number, number] = [700, 400];

  // options
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = false;
  public xAxisLabel = '01/10/2025 - 03/10/2025';
  public showYAxisLabel = false;
  public yAxisLabel = 'Uso diário';
  public isTooltipDisabled = true;

  public customColors: { name: string; value: string }[] = [];

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['usage'].currentValue && changes['usage'].currentValue.length) {
      this.setChartColorScheme(this.usage);
    }
  }

  public onSelect(event: any): void {
    console.log(event);
  }

  private setChartColorScheme(data: any): void {
    this.customColors = data.map((item: any) => ({
      name: item.name,
      value: '#1890ff',
    }));
  }
}
