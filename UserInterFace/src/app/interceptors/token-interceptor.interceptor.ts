import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthorizationService } from '../services/authorization.service';
import { AlertController } from '@ionic/angular';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authorization: AuthorizationService, private alertController: AlertController) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    const token = this.authorization.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          User: this.authorization.getAuthLocal().uid,
        },
      });
    }
    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }
  private async handleError(error: HttpErrorResponse) {    
    console.log(error);
    
    const modal = await this.alertController.create({
      header: 'Error',
      message: error.error.error || error.error.message || error.message,
      buttons: ['OK']
    });
    await modal.present();
    }
}