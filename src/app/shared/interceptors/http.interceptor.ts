import {
  HttpInterceptorFn,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const started = performance.now();

  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        const elapsed = performance.now() - started;
        console.log(
          `Request for ${req.urlWithParams} took ${elapsed.toFixed(2)} ms.`
        );
      }
    }),
    map((event) => {
      const elapsed = (performance.now() - started) / 1000;

      if (
        event.type === HttpEventType.Response &&
        event instanceof HttpResponse
      ) {
        const { body } = event;

        if (body) {
          const modifiedBody = {
            data: body,
            responseTime: elapsed.toFixed(2),
          };

          return event.clone({ body: modifiedBody });
        }
      }

      return event;
    })
  );
};
