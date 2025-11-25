import { Component } from '@angular/core';
import { UsageChartComponent } from './components/usage-chart/usage-chart.component';

@Component({
  selector: 'app-data',
  imports: [UsageChartComponent],
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss',
})
export class DataComponent {}
