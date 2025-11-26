import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoadingComponent } from './pages/portafolios/loading/loading.component';
import { TerminalComponent } from './pages/portafolios/terminal/terminal.component';
import { SharedModule } from './shared/shared.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ContactFormComponent } from './pages/portafolios/contact-form/contact-form.component';


@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    TerminalComponent,
    ContactFormComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
