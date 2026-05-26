package com.smartcart.controller;

import com.smartcart.entity.Cart;
import com.smartcart.entity.Order;
import com.smartcart.service.CartService;
import com.smartcart.service.OrderService;
import com.smartcart.service.RazorpayService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final RazorpayService razorpayService;
    private final CartService cartService;
    private final OrderService orderService;

    public PaymentController(RazorpayService razorpayService, CartService cartService, OrderService orderService) {
        this.razorpayService = razorpayService;
        this.cartService = cartService;
        this.orderService = orderService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createPaymentOrder() {
        try {
            Cart cart = cartService.getCart();
            if (cart.getItems().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Cannot checkout an empty cart"));
            }

            // Calculate cart subtotal
            BigDecimal subtotal = cart.getItems().stream()
                    .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            String receipt = "receipt_user_cart_" + System.currentTimeMillis();
            Map<String, Object> razorpayOrder = razorpayService.createOrder(subtotal, receipt);

            // Send back order details along with the Razorpay Key ID for client integration
            Map<String, Object> response = new HashMap<>(razorpayOrder);
            response.put("razorpayKey", razorpayService.getKeyId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to create payment order: " + e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> payload) {
        String orderId = payload.get("razorpay_order_id");
        String paymentId = payload.get("razorpay_payment_id");
        String signature = payload.get("razorpay_signature");

        if (orderId == null || paymentId == null || signature == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing required payment verification fields"));
        }

        boolean isValid = razorpayService.verifySignature(orderId, paymentId, signature);

        if (isValid) {
            try {
                // Place the order in database upon successful payment verification
                Order order = orderService.placeOrder(paymentId);
                return ResponseEntity.ok(order);
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Map.of("error", "Payment verified but failed to place order: " + e.getMessage()));
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid payment signature. Transaction rejected."));
        }
    }
}
