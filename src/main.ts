import 'zone.js/dist/zone';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppLoader } from './app-loader';
import { SomeModule } from './some/some.module';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, SomeModule],
  template: `
    <h1>Hello from {{name}}!</h1>
    <a target="_blank" href="https://angular.io/start">
      Learn more about Angular 
    </a>
  `,
})
export class App implements OnInit {
  name = 'Angular';

  constructor(private appLoader: AppLoader) {}

  ngOnInit() {
    this.appLoader.init();
  }
}

bootstrapApplication(App);
