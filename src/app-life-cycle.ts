import { ProviderToken, Injectable, inject } from '@angular/core';
import { IAService, IBService } from './data.service';

/** IMPLEMENTATION */

type Tokenize<T> = {
  [Index in keyof T]: ProviderToken<T[Index]>;
};

export interface Listener<T extends readonly unknown[]> {
  deps: Tokenize<T>;
  cb: (...arg1: T) => void;
}

@Injectable({
  providedIn: 'root',
})
export class AppLifeCycle {
  onInit = new LifecycleListener();

  onDestroy = new LifecycleListener();
}

class LifecycleListener {
  private listeners: Listener<readonly unknown[]>[] = [];

  private triggered = false;

  constructor() {}

  register<T extends readonly unknown[] | []>(data: Listener<T>): void {
    if (this.triggered) {
      data.cb(this.instantiateServices(data.deps));
      return;
    }

    this.listeners.push(data);
  }

  init() {
    this.listeners.forEach((l) => l.cb(this.instantiateServices(l.deps)));
    this.triggered = true;
  }

  private instantiateServices(deps: ProviderToken<T>[]) {
    return deps.map((dep) => inject(dep)) as T[];
  }
}

/** USAGE */

const test = new AppLifeCycle();

//test.onInit<[IAService, IBService]>({
test.onInit.register<[IAService, IBService]>({
  deps: [IAService, IBService],
  cb: (a, b) => console.log(`Services: ${a.sayA()}, ${b.sayB()}`),
});

test.onInit.init();
