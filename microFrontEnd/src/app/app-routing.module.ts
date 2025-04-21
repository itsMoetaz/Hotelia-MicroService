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
import { ProfileComponent } from './pages/auth/profile/profile.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserFormComponent } from './pages/users/user-form/user-form.component';


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
  { path: 'profile', component: ProfileComponent },
  { path: 'dashboard/listuser', component: UserListComponent },
  { path: 'dashboard/user-form/:id', component: UserFormComponent },  // Mise à jour d'utilisateur
  { path: 'dashboard/user-form', component: UserFormComponent },      // Ajout d'utilisateur
  { path: 'addreservation', component: AddreservationsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
