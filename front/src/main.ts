import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { isDevMode } from '@angular/core';
import { Settings } from 'luxon';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    Settings.defaultLocale = 'pl';
  })
  .catch((err) => {
    if (isDevMode()) {
      // eslint-disable-next-line no-console
      console.error('Error during bootstrap:', err);
    }
  });
