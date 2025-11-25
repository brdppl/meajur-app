import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageChartComponent } from './usage-chart.component';

describe('UsageChartComponent', () => {
  let component: UsageChartComponent;
  let fixture: ComponentFixture<UsageChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsageChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
