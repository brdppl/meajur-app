import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  public parseDate(date: string): string {
    const day = date.split('-')[2];
    const month = date.split('-')[1];
    const year = date.split('-')[0];

    return `${day}/${month}/${year}`;
  }

  public formatRangeDate(startDate: string, endDate: string): string {
    return `${this.parseDate(startDate)} - ${this.parseDate(endDate)}`;
  }

  public truncate(text: string, limit = 24): string {
    return text?.length > limit ? `${text.slice(0, limit)}...` : text;
  }
}
