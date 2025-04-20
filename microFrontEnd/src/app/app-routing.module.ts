import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { RoomsComponent } from './pages/chambres/rooms/rooms.component';
import { ChambreFormComponent } from './pages/chambres/chambre-form/chambre-form.component';
import { ListreservationsComponent } from "./pages/reservations/listreservations/listreservations.component";
import { DetailReservationsComponent } from "./pages/reservations/detail-reservations/detail-reservations.component";
import { AddreservationsComponent } from "./pages/reservations/addreservations/addreservations.component";
import { LoginComponent } from "./pages/auth/login/login.component";
import { RegisterComponent } from "./pages/auth/register/register.component";
import { ClientRoomsComponent } from './pages/client-rooms/client-rooms.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'client-rooms', component: ClientRoomsComponent },
  { path: 'rooms', component: RoomsComponent },


  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/rooms', component: RoomsComponent },
  { path: 'dashboard/rooms/add', component: ChambreFormComponent },
  { path: 'dashboard/rooms/edit/:id', component: ChambreFormComponent },
  { path: 'reservation-detail/:id', component: DetailReservationsComponent }, // Route pour les détails
  { path: 'dashboard/listreservation', component: ListreservationsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'addreservation', component: AddreservationsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
