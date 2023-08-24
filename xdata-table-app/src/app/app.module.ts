import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TableDataComponent } from './table-data/table-data.component';
import { CommonModule } from '@angular/common';
import { ResizeColumnDirective } from './table-data/resize-column.directive';

@NgModule({
  declarations: [AppComponent, TableDataComponent, ResizeColumnDirective],
  imports: [BrowserModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
