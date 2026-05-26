package com.smartcart.controller;

import com.smartcart.entity.Product;
import com.smartcart.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/similar/{productId}")
    public ResponseEntity<List<Product>> getSimilarProducts(@PathVariable Long productId) {
        return ResponseEntity.ok(recommendationService.getSimilarProducts(productId));
    }

    @GetMapping("/frequently-bought/{productId}")
    public ResponseEntity<List<Product>> getFrequentlyBoughtTogether(@PathVariable Long productId) {
        return ResponseEntity.ok(recommendationService.getFrequentlyBoughtTogether(productId));
    }

    @GetMapping("/personal")
    public ResponseEntity<List<Product>> getPersonalRecommendations() {
        return ResponseEntity.ok(recommendationService.getPersonalRecommendations());
    }

    @GetMapping("/trending")
    public ResponseEntity<List<Product>> getTrendingProducts() {
        return ResponseEntity.ok(recommendationService.getTrendingProducts());
    }
}
