import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotelServiceService } from '../../../services/hotel-service.service';
import { PaymentService } from '../../../services/payment.service1';
import { HotelService } from '../../../models/hotel-service.model';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../models/environment';

@Component({
  selector: 'app-service-payment',
 templateUrl: './service-payment.component.html',
  styleUrls: ['./service-payment.component.css']
})
export class ServicePaymentComponent implements OnInit {
  service: HotelService | null = null;
  loading = true;
  processingPayment = false;
  paymentSuccess = false;
  paymentError = '';
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  card: StripeCardElement | null = null;
  paymentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelServiceService: HotelServiceService,
    private paymentService: PaymentService,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async ngOnInit(): Promise<void> {
    // Get service ID from route params
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadService(id);
    } else {
      this.loading = false;
      this.paymentError = 'Invalid service ID';
    }

    // Initialize Stripe
    this.stripe = await loadStripe(environment.stripePublicKey);
    if (!this.stripe) {
      this.paymentError = 'Failed to load payment processor';
      return;
    }
  }

  loadService(id: number): void {
    this.hotelServiceService.getServiceById(id)
      .subscribe({
        next: (data) => {
          this.service = data;
          this.loading = false;
          this.setupStripeElements();
        },
        error: (err) => {
          this.loading = false;
          this.paymentError = 'Failed to load service details';
          console.error(err);
        }
      });
  }

  setupStripeElements(): void {
    if (!this.stripe) {
      this.paymentError = 'Payment processor not available';
      return;
    }

    this.elements = this.stripe.elements();
    this.card = this.elements.create('card', {
      style: {
        base: {
          iconColor: '#666EE8',
          color: '#31325F',
          fontWeight: '400',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSize: '16px',
          '::placeholder': {
            color: '#CFD7E0'
          }
        }
      }
    });

    // Mount the card element to the DOM
    setTimeout(() => {
      if (this.card) {
        this.card.mount('#card-element');
        
        // Add event listener for errors
        this.card.on('change', (event) => {
          const displayError = document.getElementById('card-errors');
          if (displayError) {
            if (event.error) {
              displayError.textContent = event.error.message;
            } else {
              displayError.textContent = '';
            }
          }
        });
      }
    }, 100);
  }

  async handlePayment(): Promise<void> {
    if (!this.service || !this.stripe || !this.card || this.paymentForm.invalid) {
      return;
    }

    this.processingPayment = true;

    try {
      // Step 1: Create a payment intent on the server
      const paymentIntentResponse = await this.paymentService.createPaymentIntent(
        this.service.id!, 
        this.service.price * 100 // Convert to cents
      ).toPromise();

      // Step 2: Confirm the payment with Stripe.js
      const result = await this.stripe.confirmCardPayment(paymentIntentResponse!.clientSecret, {
        payment_method: {
          card: this.card,
          billing_details: {
            name: this.paymentForm.get('name')!.value,
            email: this.paymentForm.get('email')!.value
          }
        }
      });

      if (result.error) {
        // Show error to customer
        this.paymentError = result.error.message || 'An error occurred during payment processing';
        this.processingPayment = false;
      } else {
        // Payment succeeded
        if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
          // Record the successful payment on the server
          await this.paymentService.recordPayment(
            result.paymentIntent.id,
            this.service.id!
          ).toPromise();
          
          this.paymentSuccess = true;
          this.processingPayment = false;
          
          // Redirect to success page after a short delay
          setTimeout(() => {
            this.router.navigate(['/payment-success', this.service!.id]);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      this.paymentError = 'An unexpected error occurred. Please try again later.';
      this.processingPayment = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/services/details', this.service!.id]);
  }
}
