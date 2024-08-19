import {
	ApplicationConfig,
	enableProdMode,
	importProvidersFrom,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { environment } from '../environments/environment';

import { routes } from './app.routes';

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
