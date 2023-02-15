/**
 * Copyright (C) TomTec Imaging Systems GmbH, 2023. All rights reserved.
 *
 * The source code is protected by copyright laws and international copyright treaties, as well as
 * other intellectual property laws and treaties.
 **/

import { Injectable, Injector, ProviderToken } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

type Tokenize<T> = {
  [Index in keyof T]: ProviderToken<T[Index]>;
};

type LifecycleDeps = readonly unknown[];

export abstract class LifecycleEvent<T extends LifecycleDeps> {
  // TODO [murban] PA-6763: Ideally, the deps should be readonly. Can we init them privately somehow?
  deps: T;
}

export class Init<T extends LifecycleDeps> extends LifecycleEvent<T> {}

class Login<T extends LifecycleDeps> extends LifecycleEvent<T> {}

class Exit<T extends LifecycleDeps> extends LifecycleEvent<T> {}

@Injectable({
  providedIn: 'root',
})
export class AppLifecycle {
  private subjects = new Map<
    Subject<LifecycleEvent<LifecycleDeps>>,
    ProviderToken<unknown>[]
  >();

  constructor(private readonly injector: Injector) {}

  register<T extends readonly unknown[]>(
    tokens: Tokenize<T>
  ): Observable<LifecycleEvent<T>> {
    //const subject = new BehaviorSubject<LifecycleEvent<T>>(new None<T>());
    const subject = new BehaviorSubject(null);
    this.subjects.set(subject, tokens as unknown as ProviderToken<unknown>[]);
    return subject.pipe(
      // Filter the initial null value until we get a real event emitted from the app.
      // Needed because we want a BehaviorSubject for late subscribers, but they should not get null.
      // TODO [murban] PA-6763: Is this the right approach to use a BehaviorSubject and filter the initial null value?
      filter((event) => !!event)
    );
  }

  emit(event: LifecycleEvent<unknown[]>) {
    this.subjects.forEach((tokens, subject) => {
      event.deps = tokens?.map((token) => this.injector.get(token)) ?? [];
      subject.next(event);
    });
  }
}

/** MOCK SERVICES */

export abstract class IAService {
  sayA(): string {
    return 'A';
  }
}

export abstract class IBService {
  sayB(): string {
    return 'B';
  }
}

/** USAGE */

const appLifecycle = new AppLifecycle(null);

// Duplicate services in generic type and arguments are not nice:
// appLifecycle.register<[IAService, IBService]>([IAService, IBService])
// But this can be avoided with const:
appLifecycle
  .register([IAService, IBService] as const)
  .pipe(
    //first(event => event instanceof Init, null)
    filter((event) => event instanceof Init),
    take(1)
  )
  .subscribe((event) => {
    const aService = event.deps[0];
    aService.sayA();
    //aService.sayB(); // <- Computer says "NO"! ;-)

    const bService = event.deps[1];
    bService.sayB();
  });

appLifecycle.emit(new Init());
