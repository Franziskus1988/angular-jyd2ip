import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLoader, APP_LOADER } from '../app-loader';
import { DataService } from '../data.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    DataService,
    AppLoader,
    {
      provide: APP_LOADER,
      multi: true,
      useValue: () => {
        console.log('SOME FACTORY');
      },
    },
    {
      provide: APP_LOADER,
      multi: true,
      useFactory: (dataService: DataService) => {
        return () => console.log(dataService.value);
      },
      deps: [DataService],
    },
  ],
  declarations: [],
})
export class SomeModule {}
