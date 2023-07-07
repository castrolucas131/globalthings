import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [FormsModule,
    ReactiveFormsModule,
    HttpClientModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [Network, HTTP, SQLite, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
