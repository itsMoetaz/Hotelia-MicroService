package com.hotel.ms.gestionhotel.gestionServices.payment;



import com.hotel.ms.gestionhotel.gestionServices.HotelService;
import com.hotel.ms.gestionhotel.gestionServices.IServiceService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:4200")
public class PaymentController {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Autowired
    private IServiceService serviceService;

    @Autowired
    private PaymentRepository paymentRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<CreatePaymentResponse> createPaymentIntent(@RequestBody CreatePaymentRequest request) {
        try {
            // Fetch the service to verify it exists and get the price
            HotelService service = serviceService.getHotelService(request.getServiceId());
            if (service == null) {
                return ResponseEntity.badRequest().build();
            }

            // Create payment intent parameters
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) (service.getPrice() * 100)) // Amount in cents
                    .setCurrency("usd")
                    .setDescription("Payment for " + service.getName())
                    .putMetadata("serviceId", service.getId().toString())
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .build();

            // Create payment intent with Stripe API
            PaymentIntent paymentIntent = PaymentIntent.create(params);

            return ResponseEntity.ok(new CreatePaymentResponse(paymentIntent.getClientSecret()));
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/record-payment")
    public ResponseEntity<PaymentRecord> recordPayment(@RequestBody RecordPaymentRequest request) {
        try {
            // Verify the payment intent exists and is successful
            PaymentIntent paymentIntent = PaymentIntent.retrieve(request.getPaymentIntentId());

            if (!"succeeded".equals(paymentIntent.getStatus())) {
                return ResponseEntity.badRequest().build();
            }

            // Get the service
            HotelService service = serviceService.getHotelService(request.getServiceId());
            if (service == null) {
                return ResponseEntity.badRequest().build();
            }

            // Create a payment record
            PaymentRecord paymentRecord = new PaymentRecord();
            paymentRecord.setPaymentIntentId(request.getPaymentIntentId());
            paymentRecord.setServiceId(request.getServiceId());
            paymentRecord.setAmount(service.getPrice());
            paymentRecord.setTimestamp(new java.util.Date());
            paymentRecord.setStatus("COMPLETED");

            // Save the payment record
            paymentRepository.save(paymentRecord);

            return ResponseEntity.ok(paymentRecord);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}