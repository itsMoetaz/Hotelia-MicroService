package com.example.gestionreservation;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody Map<String, Object> data) throws StripeException {
        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();

        SessionCreateParams.LineItem item = SessionCreateParams.LineItem.builder()
                .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("eur")
                                .setUnitAmount(((Number) data.get("amount")).longValue()) // en centimes
                                .setProductData(
                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                .setName((String) data.get("name"))
                                                .build()
                                )
                                .build()
                )
                .setQuantity(1L)
                .build();

        lineItems.add(item);

        SessionCreateParams params = SessionCreateParams.builder()
                .addAllLineItem(lineItems)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:4200/listreservation")
                .setCancelUrl("http://localhost:4200/cancel")
                .build();

        Session session = Session.create(params);
        Map<String, String> responseData = new HashMap<>();
        responseData.put("id", session.getId());

        return ResponseEntity.ok(responseData);
    }
}
