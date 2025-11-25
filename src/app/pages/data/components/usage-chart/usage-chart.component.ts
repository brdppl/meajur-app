import { Component, OnInit, signal } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { single } from '../../../../mock/usage-data.mock';

@Component({
  selector: 'app-usage-chart',
  imports: [NgxChartsModule],
  templateUrl: './usage-chart.component.html',
  styleUrl: './usage-chart.component.scss',
})
export class UsageChartComponent implements OnInit {
  public single = signal<any[]>([]);

  public view: [number, number] = [700, 400];

  // options
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = true;
  public xAxisLabel = '01/10/2025 - 03/10/2025';
  public showYAxisLabel = true;
  public yAxisLabel = 'Uso diário';
  public isTooltipDisabled = true;

  public customColors: { name: string; value: string }[] = [];

  public ngOnInit(): void {
    this.fetchData();
  }

  public onSelect(event: any): void {
    console.log(event);
  }

  private fetchData(): void {
    this.single.set(single);
    this.setChartColorScheme(single);
  }

  private setChartColorScheme(data: any): void {
    this.customColors = data.map((item: any) => ({
      name: item.name,
      value: '#1890ff',
    }));
  }
}
