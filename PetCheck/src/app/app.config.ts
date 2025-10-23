import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import {  initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore, enableIndexedDbPersistence } from '@angular/fire/firestore';
import { authReducer } from './core/store/auth/auth.reducer';
import { petReducer } from './core/store/pets/pets.reducer';
import { userReducer } from './core/store/user/user.reducer';
import { AuthEffects } from './core/store/auth/auth.effects';
import { PetEffects } from './core/store/pets/pets.effects';
import { UserEffects } from './core/store/user/user.effects';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { reminderReducer } from './core/store/reminders/reminders.reducer';
import { reminderEffects } from './core/store/reminders/reminder.effects';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBLb6gK4thvmfCdEvaOqaxNrlo-ruOZV9o",
  authDomain: "petcheck-c6543.firebaseapp.com",
  projectId: "petcheck-c6543",
  storageBucket: "petcheck-c6543.firebasestorage.app",
  messagingSenderId: "370355042235",
  appId: "1:370355042235:web:4e6ed52bd4b5ac8e39f69e"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }), 
    provideStore({
      auth: authReducer,
      pets: petReducer,
      users: userReducer,
      reminders: reminderReducer,
    }), 
    provideEffects([AuthEffects, PetEffects, UserEffects, reminderEffects]),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => {
      const firestore = getFirestore();
      enableIndexedDbPersistence(firestore).catch(err => {
        console.warn('Firestore Persistence not enabled:', err);
      });
      return firestore;
    }),
    provideMessaging(() => getMessaging()),
  ]
};
