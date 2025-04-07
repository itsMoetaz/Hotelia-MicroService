import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../models/environment';
export interface PaymentIntent {
  clientSecret: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = 'http://localhost:8000/api/payments';

  constructor(private http: HttpClient) { }

  // Create a payment intent for a specific service
  createPaymentIntent(serviceId: number, amount: number): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(`${this.baseUrl}/create-payment-intent`, {
      serviceId,
      amount
    });
  }

  // Record a successful payment
  recordPayment(paymentIntentId: string, serviceId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/record-payment`, {
      paymentIntentId,
      serviceId
    });
  }
}