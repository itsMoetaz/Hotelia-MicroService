import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { ServiceDetailsComponent } from './components/service-detail/service-detail.component';
import { ServiceFormComponent } from './components/service-form/service-form.component';
import { ServicePaymentComponent } from './components/service-payment/service-payment.component';
import { PaymentSuccessComponent } from './components/payment-succes/payment-succes.component';


const routes: Routes = [
  { path: '', redirectTo: '/services', pathMatch: 'full' },
  { path: 'services', component: ServiceListComponent },
  { path: 'services/add', component: ServiceFormComponent },
  { path: 'services/edit/:id', component: ServiceFormComponent },
  { path: 'services/details/:id', component: ServiceDetailsComponent },
   { path: 'services/payment/:id', component: ServicePaymentComponent },
  { path: 'payment-success/:id', component: PaymentSuccessComponent },
  { path: '**', redirectTo: '/services' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
