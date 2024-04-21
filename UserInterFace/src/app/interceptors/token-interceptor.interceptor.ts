import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthorizationService } from '../services/authorization.service';
import { LoadingService } from '../services/loading-service.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authorization: AuthorizationService, private loadingService: LoadingService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingService.setLoading(true);
    const token = this.authorization.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          User: this.authorization.getAuthLocal().uid,
        },
      });
    }
    return next.handle(request).pipe(finalize(() => this.loadingService.setLoading(false)));
  }
}