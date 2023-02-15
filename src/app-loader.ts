import { Inject, Injectable, InjectionToken } from '@angular/core';
import { AppLifeCycle, IAService, IBService } from './app-life-cycle';

export type Loaders = () => {};

export const APP_LOADER = new InjectionToken<Loaders>('APP_LOADER');

@Injectable({
  providedIn: 'root',
})
export class AppLoader {
  constructor(@Inject(APP_LOADER) private readonly appLoaders: Loaders[]) {
    console.log('AppLoader');
    console.log('AppLoaders number:', this.appLoaders.length);
  }

  init() {
    
    console.log("Init app.")

    this.appLoaders.forEach((cb) => cb());

    const test = new AppLifeCycle();

    test.onInit({
      deps: [IAService, IBService],
      cb: (a, b) => console.log(`Services: ${a}, ${b}`),
    });

    test.init();
  }
}
