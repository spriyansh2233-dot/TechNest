const fs = require('fs');
const path = require('path');

const seedCode = fs.readFileSync(path.join(__dirname, '../generated_seedProducts.txt'), 'utf-8');
const seederFile = path.join(__dirname, '../backend/src/main/java/com/smartcart/config/DatabaseSeeder.java');

const fullContent = `package com.smartcart.config;

import com.smartcart.entity.Product;
import com.smartcart.entity.Role;
import com.smartcart.entity.User;
import com.smartcart.repository.ProductRepository;
import com.smartcart.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(ProductRepository productRepository, UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedProducts();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User user = new User();
            user.setName("John Doe");
            user.setEmail("user@technest.com");
            user.setPassword(passwordEncoder.encode("password123"));
            user.setRole(Role.USER);
            userRepository.save(user);

            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@technest.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }
    }

    private void seedProducts() {
        if (productRepository.count() < 40) {
            System.out.println("Clearing old product catalog to build premium NOVA brand...");
            productRepository.deleteAll();
        }

${seedCode}
    }

    private void seedProduct(String name, String brand, String desc, String price, String cat, String img, double rating, int stock) {
        Optional<Product> existing = productRepository.findAll().stream()
                .filter(p -> p.getName().equals(name))
                .findFirst();

        if (existing.isEmpty()) {
            Product product = new Product(null, name, desc, new BigDecimal(price), BigDecimal.ZERO, stock, cat, img, null);
            product.setBrand(brand);
            product.setRating(rating);
            productRepository.save(product);
            System.out.println("Created new NOVA product: " + name);
        } else {
            Product product = existing.get();
            if (!img.equals(product.getImageUrl()) || !brand.equals(product.getBrand()) || product.getRating() != rating) {
                product.setImageUrl(img);
                product.setBrand(brand);
                product.setRating(rating);
                productRepository.save(product);
                System.out.println("Updated product: " + name);
            }
        }
    }
}
`;

fs.writeFileSync(seederFile, fullContent);
console.log("DatabaseSeeder.java has been successfully generated.");
