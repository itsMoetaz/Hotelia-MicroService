import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { RoomsComponent } from './pages/chambres/rooms/rooms.component';
//import { ChambreFormComponent } from './pages/chambre-form/chambre-form.component';
import { ChambreFormComponent } from './pages/chambres/chambre-form/chambre-form.component';

import { HistoriqueFormComponent } from './pages/chambres/historique-form/historique-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ListreservationsComponent } from './pages/reservations/listreservations/listreservations.component';
import { DetailReservationsComponent } from './pages/reservations/detail-reservations/detail-reservations.component';
import { AddreservationsComponent } from './pages/reservations/addreservations/addreservations.component';
import { PaymentComponent } from './pages/reservations/payment/payment.component';
import { FilterByAvailabilityPipe } from './pages/home/filter-by-availability.pipe';
import { ClientRoomsComponent } from './pages/client-rooms/client-rooms.component';
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    DashboardComponent,
    RoomsComponent,
    ChambreFormComponent,
    HistoriqueFormComponent,
    LoginComponent,
    RegisterComponent,
    ListreservationsComponent,
    DetailReservationsComponent,
    AddreservationsComponent,
    PaymentComponent,
    FilterByAvailabilityPipe,
    ClientRoomsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
