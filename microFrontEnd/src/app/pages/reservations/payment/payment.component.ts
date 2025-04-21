// payment.component.ts
import { Component } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  template: `<button (click)="pay()">Payer</button>`,
})
export class PaymentComponent {
  stripePromise = loadStripe('pk_test_51RBMki4NCECvuRy85Ev8DO6gdHf7QFBSi2pkSwpPS5mjcuQjxqDjnRuw3jeB0nfvfxkMD8HWrc9jkV79nmJgpm5l00RojlUKNH'); // Clé publique

  constructor(private http: HttpClient) {}

  async pay() {
    const stripe = await this.stripePromise;
    this.http.post<any>('http://localhost:8086/api/payment/create-checkout-session', {
      name: 'Réservation Chambre',
      amount: 2000 // 20.00 EUR
    }).subscribe(async (session) => {
      const result = await stripe?.redirectToCheckout({ sessionId: session.id });
      if (result?.error) {
        console.error(result.error.message);
      }
    });
  }
}
