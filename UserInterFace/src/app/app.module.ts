import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AuthorizationService } from './services/authorization.service';
import {
  DevTools,
  NgxTolgeeModule,
  Tolgee,
  TOLGEE_INSTANCE,
  FormatSimple,
  LanguageStorage,
  BackendFetch,
} from '@tolgee/ngx';
import { LangSelectorComponent } from './lang-selector/lang-selector.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token-interceptor.interceptor';
@NgModule({
  declarations: [AppComponent, LoginComponent, LangSelectorComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    NgxTolgeeModule,
    
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthorizationService,
    {
      provide: TOLGEE_INSTANCE,
      useFactory: () => {
        return Tolgee()
          .use(DevTools())
          .use(FormatSimple())
          .use(LanguageStorage())
          .use(BackendFetch({}))

          .init({
            availableLanguages: ['en', 'fa', 'zh', 'ru'],
            defaultLanguage: 'en',
            // for development

            fallbackLanguage: 'en',
            apiUrl: environment.tolgee.tolgeeApiUrl,
            apiKey: environment.tolgee.tolgeeApiKey,
            staticData: {
              'en:namespaced': () => import('../i18n/namespaced/en.json'),
              'fa:namespaced': () => import('../i18n/namespaced/fa.json'),
              'zh:namespaced': () => import('../i18n/namespaced/zh.json'),
              'ru:namespaced': () => import('../i18n/namespaced/ru.json'),
              en: () => import('../i18n/en.json'),
              fa: () => import('../i18n/fa.json'),
              zh: () => import('../i18n/zh.json'),
              ru: () => import('../i18n/ru.json'),
            },
          });
      },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  exports: [NgxTolgeeModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
