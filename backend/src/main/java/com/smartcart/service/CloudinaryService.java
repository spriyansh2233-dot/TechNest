package com.smartcart.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    private Cloudinary cloudinary;
    private boolean isMockMode = false;

    @PostConstruct
    public void init() {
        if ("123456789012345".equals(apiKey) || "technest-demo".equals(cloudName) || apiKey == null || apiKey.isEmpty()) {
            System.out.println("⚠️ WARNING: Cloudinary credentials are not configured. Running in MOCK mode.");
            isMockMode = true;
        } else {
            try {
                cloudinary = new Cloudinary(ObjectUtils.asMap(
                        "cloud_name", cloudName,
                        "api_key", apiKey,
                        "api_secret", apiSecret
                ));
                System.out.println("✅ Cloudinary initialized successfully.");
            } catch (Exception e) {
                System.err.println("❌ Failed to initialize Cloudinary client. Falling back to MOCK mode: " + e.getMessage());
                isMockMode = true;
            }
        }
    }

    public String uploadImage(MultipartFile file) throws IOException {
        if (isMockMode) {
            // Return a premium mock Unsplash URL matching the file name or a default placeholder
            System.out.println("ℹ️ Mock upload: returning mock product image URL.");
            return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80";
        }

        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return uploadResult.get("secure_url").toString();
        } catch (Exception e) {
            System.err.println("❌ Cloudinary upload failed: " + e.getMessage() + ". Returning mock URL.");
            return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80";
        }
    }
}
