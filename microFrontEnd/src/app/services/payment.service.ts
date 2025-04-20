import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  stripePromise = loadStripe('pk_test_51RBMki4NCECvuRy85Ev8DO6gdHf7QFBSi2pkSwpPS5mjcuQjxqDjnRuw3jeB0nfvfxkMD8HWrc9jkV79nmJgpm5l00RojlUKNH'); // ta clé publique Stripe

  constructor(private http: HttpClient) {}

  async pay(name: string, amount: number) {
    const stripe = await this.stripePromise;
    const session = await this.http.post<any>('http://localhost:8082/api/payment/create-checkout-session', {
      name,
      amount
    }).toPromise();

    return stripe?.redirectToCheckout({ sessionId: session.id });
  }
}
