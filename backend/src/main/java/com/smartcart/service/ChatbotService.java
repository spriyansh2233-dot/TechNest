package com.smartcart.service;

import com.smartcart.entity.Order;
import com.smartcart.entity.User;
import com.smartcart.repository.OrderRepository;
import com.smartcart.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class ChatbotService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public ChatbotService(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    private Optional<User> getLoggedInUserOpt() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            return userRepository.findByEmail(email);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public String respondToMessage(String message) {
        if (message == null || message.trim().isEmpty()) {
            return "Hello! I am your TechNest AI Assistant. How can I help you today?";
        }

        String msg = message.toLowerCase().trim();

        // 1. GREETINGS
        if (msg.contains("hi") || msg.contains("hello") || msg.contains("hey") || msg.contains("greetings") || msg.contains("ola")) {
            return "Hi there! 👋 Welcome to TechNest AI Chatbot. I'm here to assist you with order tracking, return policies, payment issues, and product suggestions. What can I do for you today?";
        }

        // 2. ORDER TRACKING / STATUS
        if (msg.contains("order") || msg.contains("track") || msg.contains("package") || msg.contains("delivery") || msg.contains("status") || msg.contains("ship")) {
            Optional<User> userOpt = getLoggedInUserOpt();
            if (userOpt.isEmpty()) {
                return "I would be happy to help you track your order! Please log in to your account so I can securely fetch your order history. 🔒";
            }

            User user = userOpt.get();
            List<Order> orders = orderRepository.findByUser(user);

            if (orders.isEmpty()) {
                return "Hi " + user.getName() + ", I checked our database and it looks like you haven't placed any orders yet. 🛍️ If you'd like, I can suggest some top trending electronics for you! Just ask me for 'recommendations'.";
            }

            // Find the most recent order
            Order latestOrder = orders.stream()
                    .max((o1, o2) -> o1.getCreatedAt().compareTo(o2.getCreatedAt()))
                    .get();

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy hh:mm a");
            String formattedDate = latestOrder.getCreatedAt().format(formatter);

            return "Hi " + user.getName() + "! I found your latest order:\n\n" +
                    "📦 **Order ID:** #" + latestOrder.getId() + "\n" +
                    "📅 **Placed on:** " + formattedDate + "\n" +
                    "💵 **Total:** $" + latestOrder.getTotalAmount() + "\n" +
                    "🔄 **Current Status:** `" + latestOrder.getStatus() + "`\n" +
                    "💳 **Payment Transaction:** `" + latestOrder.getPaymentId() + "`\n\n" +
                    "If you have any issues or need to cancel this order, you can manage it directly from your User Dashboard! Let me know if you need help with anything else.";
        }

        // 3. RETURNS & REFUNDS
        if (msg.contains("return") || msg.contains("refund") || msg.contains("replace") || msg.contains("exchange") || msg.contains("policy")) {
            return "At TechNest, we strive for 100% satisfaction! 🌟\n\n" +
                    "• **Return Period:** You can return any item within **30 days** of delivery.\n" +
                    "• **Condition:** Items must be unused and in their original packaging.\n" +
                    "• **Process:** Simply go to your User Dashboard, find the order under history, and click 'Initiate Return'.\n" +
                    "• **Refunds:** Once we receive the product, your refund will be processed within **3-5 business days** to your original payment method.";
        }

        // 4. PAYMENTS & CHECKOUT
        if (msg.contains("pay") || msg.contains("payment") || msg.contains("razorpay") || msg.contains("checkout") || msg.contains("credit") || msg.contains("upi") || msg.contains("card")) {
            return "TechNest uses **Razorpay** to process payments securely. 💳 We accept:\n" +
                    "• Credit & Debit Cards (Visa, Mastercard, RuPay)\n" +
                    "• UPI (Google Pay, PhonePe, Paytm)\n" +
                    "• Net Banking & Digital Wallets\n\n" +
                    "All transactions are protected by bank-grade 256-bit encryption. If your transaction fails but money is debited, it will be automatically refunded by your bank within 24 hours.";
        }

        // 5. CANCELLATION
        if (msg.contains("cancel") || msg.contains("stop")) {
            return "You can easily cancel an order before it has been shipped! 🚫 Go to your **Order History** in your User Dashboard, locate the order, and click the 'Cancel Order' button. The stock will immediately be updated in our catalog and your payment will be fully refunded within 24 hours.";
        }

        // 6. RECOMMENDATIONS
        if (msg.contains("recommend") || msg.contains("suggest") || msg.contains("buy") || msg.contains("trending") || msg.contains("popular") || msg.contains("electronics")) {
            return "Our AI recommendation engine is currently pointing to these best-sellers: 🔥\n\n" +
                    "1. 🎧 **SmartVibe ANC Headphones** — $149.99 (Amazing sound and premium noise cancellation)\n" +
                    "2. 💻 **AuraBook Pro 14** — $1299.99 (Sleek minimalist powerhouse laptop)\n" +
                    "3. ⌚ **Chronos Active Smartwatch** — $199.99 (Fusing style with real-time health-tracking)\n\n" +
                    "Check them out on the Home page for a dynamic glassmorphic viewing experience!";
        }

        // 7. DEFAULT FALLBACK
        return "I am the TechNest AI Assistant! 🤖 I can answer your questions about return policy, track your package, explain payment procedures, and help you cancel orders. \n\n" +
                "Try asking me:\n" +
                "• *'Where is my order?'*\n" +
                "• *'What is your return policy?'*\n" +
                "• *'What payment methods do you support?'*\n" +
                "• *'Can you recommend something?'*";
    }
}
