import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth/auth.interceptor';
import { httpErrorInterceptor } from './core/interceptors/http-error/http-error.interceptor';
import { AppStateStore } from './core/store/app-state.store';
import { firstValueFrom, switchMap } from 'rxjs';
import { ConfigService } from './core/services/config/config.service';
import { provideAnimations } from '@angular/platform-browser/animations';

async function initializeAppFactory(configService: ConfigService) {
  try {
    await firstValueFrom(configService.getCurrencyList().pipe(switchMap(() => configService.getConfig())));
  } catch (error) {
    return Promise.resolve();
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, httpErrorInterceptor])),
    provideAnimations(),
    provideAppInitializer(() => {
      const configService = inject(ConfigService);
      return initializeAppFactory(configService);
    }),
    AppStateStore,
  ],
};
