package com.smartcart.service;

import com.smartcart.entity.Order;
import com.smartcart.entity.OrderItem;
import com.smartcart.entity.Product;
import com.smartcart.entity.User;
import com.smartcart.exception.ResourceNotFoundException;
import com.smartcart.repository.OrderRepository;
import com.smartcart.repository.ProductRepository;
import com.smartcart.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public RecommendationService(ProductRepository productRepository, OrderRepository orderRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
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

    /**
     * Recommends similar products based on matching category and price proximity.
     */
    public List<Product> getSimilarProducts(Long productId) {
        Product currentProduct = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + productId));

        List<Product> categoryProducts = productRepository.findByCategory(currentProduct.getCategory());

        return categoryProducts.stream()
                .filter(p -> !p.getId().equals(productId))
                .sorted(Comparator.comparing(p -> p.getPrice().subtract(currentProduct.getPrice()).abs()))
                .limit(4)
                .collect(Collectors.toList());
    }

    /**
     * Collaborative Filtering: Recommends products frequently bought together with the current product.
     * Searches all orders containing this product, collects other products in those orders, and ranks them by occurrence.
     */
    public List<Product> getFrequentlyBoughtTogether(Long productId) {
        List<Order> allOrders = orderRepository.findAll();
        Map<Long, Integer> productFrequencies = new HashMap<>();

        // Find orders containing the target product
        List<Order> matchingOrders = allOrders.stream()
                .filter(order -> order.getItems().stream()
                        .anyMatch(item -> item.getProduct().getId().equals(productId)))
                .collect(Collectors.toList());

        // Count other products in those orders
        for (Order order : matchingOrders) {
            for (OrderItem item : order.getItems()) {
                Long id = item.getProduct().getId();
                if (!id.equals(productId)) {
                    productFrequencies.put(id, productFrequencies.getOrDefault(id, 0) + item.getQuantity());
                }
            }
        }

        if (productFrequencies.isEmpty()) {
            // Fallback: Similar products in same category
            return getSimilarProducts(productId);
        }

        // Sort by frequency and return products
        List<Long> topProductIds = productFrequencies.entrySet().stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .limit(4)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        return productRepository.findAllById(topProductIds);
    }

    /**
     * Personalized recommendations based on user's past purchase categories.
     * If no orders exist, falls back to trending/top-selling products.
     */
    public List<Product> getPersonalRecommendations() {
        Optional<User> userOpt = getLoggedInUserOpt();
        if (userOpt.isEmpty()) {
            // Unauthenticated: return overall best-sellers
            return getTrendingProducts();
        }

        User user = userOpt.get();
        List<Order> userOrders = orderRepository.findByUser(user);

        if (userOrders.isEmpty()) {
            // Fallback to trending
            return getTrendingProducts();
        }

        // Count category preferences
        Map<String, Integer> categoryPreferences = new HashMap<>();
        for (Order order : userOrders) {
            for (OrderItem item : order.getItems()) {
                String cat = item.getProduct().getCategory();
                categoryPreferences.put(cat, categoryPreferences.getOrDefault(cat, 0) + item.getQuantity());
            }
        }

        // Get top category
        Optional<String> topCategoryOpt = categoryPreferences.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .findFirst();

        if (topCategoryOpt.isEmpty()) {
            return getTrendingProducts();
        }

        String topCategory = topCategoryOpt.get();
        List<Product> recommended = productRepository.findByCategory(topCategory);

        // Filter out already purchased items if possible, or just limit
        Set<Long> purchasedIds = userOrders.stream()
                .flatMap(order -> order.getItems().stream())
                .map(item -> item.getProduct().getId())
                .collect(Collectors.toSet());

        List<Product> filtered = recommended.stream()
                .filter(p -> !purchasedIds.contains(p.getId()))
                .limit(4)
                .collect(Collectors.toList());

        if (filtered.isEmpty()) {
            // If user bought everything in top category, return standard recommended from category
            return recommended.stream().limit(4).collect(Collectors.toList());
        }

        return filtered;
    }

    /**
     * Returns top selling products across all orders, or standard top products.
     */
    public List<Product> getTrendingProducts() {
        List<Order> orders = orderRepository.findAll();
        Map<Long, Integer> frequencies = new HashMap<>();

        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                Long id = item.getProduct().getId();
                frequencies.put(id, frequencies.getOrDefault(id, 0) + item.getQuantity());
            }
        }

        if (frequencies.isEmpty()) {
            // Return top 4 products in database
            return productRepository.findAll().stream().limit(4).collect(Collectors.toList());
        }

        List<Long> trendingIds = frequencies.entrySet().stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .limit(4)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        return productRepository.findAllById(trendingIds);
    }
}
