import {
  Component,
  Input,
  OnChanges,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  yaxis?: ApexYAxis;
  xaxis?: ApexXAxis;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
  stroke?: ApexStroke;
  legend?: ApexLegend;
};

@Component({
  selector: 'app-usage-chart',
  imports: [NgApexchartsModule],
  templateUrl: './usage-chart.component.html',
  styleUrl: './usage-chart.component.scss',
})
export class UsageChartComponent implements OnChanges {
  @Input() usage: any[] = [];
  @ViewChild('chart') chart: ChartComponent | undefined;

  public chartData = signal<any[]>([]);

  public chartOptions: any = <ChartOptions>{
    series: [
      {
        name: 'Usos neste dia',
        data: [
          { x: 'Jan', y: 3 },
          { x: 'Feb', y: 2 },
          { x: 'Mar', y: 1 },
        ],
      },
    ],
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        hideZeroBarsWhenGrouped: true,
        borderRadius: 0,
        dataLabels: {
          position: 'center', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: 0, // -20
      style: {
        fontSize: '12px',
        // colors: ['#304758'],
      },
    },
    xaxis: {
      position: 'bottom',
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      tooltip: {
        enabled: true,
      },
      labels: {
        formatter: (value: string, _: number, opts: any) => {
          if (
            opts === undefined ||
            opts.i === undefined ||
            this.chartOptions.series[0].data.length === 0
          ) {
            return value;
          }
          if (
            opts.i === 0 ||
            opts.i === this.chartOptions.series[0].data.length - 1
          ) {
            return value;
          }
          return '';
        },
        rotate: 0,
      },
    },
    yaxis: {
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      labels: {
        formatter: (val: number) => val.toFixed(0),
      },
    },
  };

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['usage'] &&
      changes['usage'].currentValue &&
      changes['usage'].currentValue?.length
    ) {
      this.chartData.set(changes['usage'].currentValue);
      this.updateChartData();
    }
  }

  public isLoading(): boolean {
    return !this.chartData() || this.chartData().length <= 0;
  }

  private updateChartData(): void {
    const newData = this.chartData()?.map((item) => ({
      x: item.name,
      y: item.value,
    }));
    this.chartOptions.series =
      this.chartOptions.series && this.chartOptions.series.length
        ? [
            {
              ...this.chartOptions.series[0],
              data: newData,
            },
          ]
        : [];

    this.chart?.updateSeries(this.chartOptions.series, true);
    this.chart?.updateOptions(this.chartOptions, true);
  }
}
