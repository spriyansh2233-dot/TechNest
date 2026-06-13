package com.smartcart.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private BigDecimal discount = java.math.BigDecimal.ZERO;

    private int stock;
    
    private String category;
    
    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    private String brand;

    private Double rating;

    private Integer reviewCount;
    
    private String deliveryEstimate;
    
    private Boolean isBestSeller;
    
    private Boolean isFreeDelivery;
    
    private BigDecimal originalPrice;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
