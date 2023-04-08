import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ExpiredTokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  // tslint:disable-next-line: no-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      // tslint:disable-next-line: no-any
      catchError((err: any) => {
        /* istanbul ignore else */
        if (err instanceof HttpErrorResponse) {
          /* istanbul ignore else */
          if (err.status === 401) {
            this.router.navigateByUrl('/login');
          }
        }
        return throwError(() => new HttpErrorResponse(err));
      }),
    );
  }
}
