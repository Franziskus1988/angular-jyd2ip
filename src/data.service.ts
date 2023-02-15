import { Injectable } from '@angular/core';


@Injectable()
export class DataService {
  constructor() {}

  value = 'DATA VALUE';
}


/** MOCK SERVICES */

export abstract class IAService {
  sayA(): string {
    return "A";
  }
}
export abstract class IBService {
  sayB(): string {
    return "B";
  }
}

export let aService: IAService;
export let bService: IBService;
