import {
	ApplicationConfig,
	enableProdMode,
	importProvidersFrom,
	NgModule,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

if (environment.production) {
	enableProdMode();
}

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes, withViewTransitions()),
		provideHttpClient(),
		importProvidersFrom(
			AngularFireModule.initializeApp(environment.firebaseConfig),
			AngularFireDatabaseModule
		),
	],
};
