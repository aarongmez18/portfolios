import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroTextComponent } from './components/hero-text/hero-text.component';
import { ButtonComponent } from './components/button/button.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component'; // si existe

@NgModule({
  declarations: [
    HeroTextComponent,
    ButtonComponent,
    SnackbarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeroTextComponent,
    ButtonComponent,
    SnackbarComponent
  ]
})
export class SharedModule { }
