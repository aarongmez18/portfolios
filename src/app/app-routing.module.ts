import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingComponent } from './pages/portafolios/loading/loading.component';
import { TerminalComponent } from './pages/portafolios/terminal/terminal.component';

const routes: Routes = [
  { path: '', component: LoadingComponent },              
  { path: 'terminal', component: TerminalComponent }, 
  { path: '**', redirectTo: '' }                            
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
