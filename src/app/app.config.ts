import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideNzI18n, pt_BR } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import {
  provideNgxWebstorage,
  withNgxWebstorageConfig,
  withLocalStorage,
  withSessionStorage,
} from 'ngx-webstorage';
import { requestInterceptor } from './shared/interceptors/http.interceptor';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideNzI18n(pt_BR),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([requestInterceptor])),
    provideNgxWebstorage(
      withNgxWebstorageConfig({ separator: ':', caseSensitive: true }),
      withLocalStorage(),
      withSessionStorage()
    ),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
};
