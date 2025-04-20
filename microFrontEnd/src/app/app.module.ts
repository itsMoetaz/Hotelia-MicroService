import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';

import { RoomsComponent } from './rooms/rooms.component';
import { ChambreFormComponent } from './pages/chambre-form/chambre-form.component';
import { AddreservationsComponent } from './pages/reservations/addreservations/addreservations.component';
import { DetailReservationsComponent } from './pages/reservations/detail-reservations/detail-reservations.component';
import { ListreservationsComponent } from './pages/reservations/listreservations/listreservations.component';
import { PaymentComponent } from './pages/reservations/payment/payment.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,

    DashboardComponent,
    RoomsComponent,
    ChambreFormComponent,
    AddreservationsComponent,
    DetailReservationsComponent,
    ListreservationsComponent,
    PaymentComponent,
    LoginComponent,
    RegisterComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    HttpClientModule,
    ReactiveFormsModule,
    FormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
