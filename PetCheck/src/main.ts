import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

async function bootStrap() {
  try {
    await bootstrapApplication(AppComponent, appConfig);

    if('serviceWorker' in navigator) {
      try {
        const registraion = await navigator.serviceWorker.register(
          '/firebase-messaging-sw.js',
          { scope: '/firebase/' }
        );
      } catch (err) {
        console.error('firebase sw registration failed:', err);
      }
    }
  } catch (err) {
    console.error('Bootstrap failed: ', err);
  }
}

bootStrap();