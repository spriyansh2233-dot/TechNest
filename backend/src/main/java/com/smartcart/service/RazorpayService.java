package com.smartcart.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class RazorpayService {

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    private RazorpayClient client;
    private boolean isMockMode = false;

    @PostConstruct
    public void init() {
        if ("rzp_test_dummyId".equals(keyId) || keyId == null || keyId.isEmpty()) {
            System.out.println("⚠️ WARNING: Razorpay credentials are not configured. Running in MOCK mode.");
            isMockMode = true;
        } else {
            try {
                client = new RazorpayClient(keyId, keySecret);
                System.out.println("✅ Razorpay Client initialized successfully.");
            } catch (Exception e) {
                System.err.println("❌ Failed to initialize Razorpay Client. Falling back to MOCK mode: " + e.getMessage());
                isMockMode = true;
            }
        }
    }

    public Map<String, Object> createOrder(BigDecimal amount, String receipt) throws Exception {
        // Razorpay amounts are in paise (cents). Multiply by 100.
        int amountInPaise = amount.multiply(BigDecimal.valueOf(100)).intValue();

        if (isMockMode) {
            Map<String, Object> mockOrder = new HashMap<>();
            mockOrder.put("id", "order_MOCK_" + System.currentTimeMillis());
            mockOrder.put("amount", amountInPaise);
            mockOrder.put("currency", "USD");
            mockOrder.put("receipt", receipt);
            mockOrder.put("status", "created");
            return mockOrder;
        }

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "USD"); // Matches product price values
        orderRequest.put("receipt", receipt);
        orderRequest.put("payment_capture", 1); // Auto capture payments

        Order order = client.orders.create(orderRequest);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));
        response.put("receipt", order.get("receipt"));
        response.put("status", order.get("status"));
        return response;
    }

    public boolean verifySignature(String orderId, String paymentId, String signature) {
        if (isMockMode) {
            System.out.println("ℹ️ Mock Verification: Signature check passed.");
            return true;
        }

        try {
            // Verify signature using Razorpay Java SDK Utils
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);
            return Utils.verifyPaymentSignature(options, keySecret);
        } catch (Exception e) {
            System.err.println("❌ Razorpay signature verification failed: " + e.getMessage());
            return false;
        }
    }

    public String getKeyId() {
        return keyId;
    }
}
