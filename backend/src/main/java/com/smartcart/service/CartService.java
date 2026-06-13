package com.smartcart.service;

import com.smartcart.entity.Cart;
import com.smartcart.entity.CartItem;
import com.smartcart.entity.Product;
import com.smartcart.entity.User;
import com.smartcart.exception.ResourceNotFoundException;
import com.smartcart.repository.CartRepository;
import com.smartcart.repository.UserRepository;
import com.smartcart.repository.ProductRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, UserRepository userRepository,
            ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public Cart getCart() {
        User user = getLoggedInUser();
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        });
    }

    public Cart addToCart(Long productId, int quantity) {
        Cart cart = getCart();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + productId));

        if (product.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock available");
        }

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + quantity;
            if (product.getStock() < newQuantity) {
                throw new RuntimeException("Insufficient stock available for the total requested quantity");
            }
            item.setQuantity(newQuantity);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
            cart.getItems().add(item);
        }

        return cartRepository.save(cart);
    }

    public Cart updateCartItem(Long productId, int quantity) {
        Cart cart = getCart();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + productId));

        if (quantity <= 0) {
            return removeFromCart(productId);
        }

        if (product.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock available");
        }

        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in cart"));

        existingItem.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(Long productId) {
        Cart cart = getCart();
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        return cartRepository.save(cart);
    }

    public void clearCart() {
        Cart cart = getCart();
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
