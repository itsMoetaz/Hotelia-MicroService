import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RoomsComponent } from './rooms/rooms.component';
import { ChambreFormComponent } from './pages/chambre-form/chambre-form.component';

const routes: Routes = [
 {path: '', component: HomeComponent},
 {path: 'dashboard', component: DashboardComponent},
 { path: 'dashboard/rooms', component: RoomsComponent },
 { path: 'rooms', component: RoomsComponent },
 { path: 'dashboard/rooms/add', component: ChambreFormComponent },
 { path: 'dashboard/rooms/edit/:id', component: ChambreFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
