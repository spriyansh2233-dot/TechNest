package com.smartcart.config;

import com.smartcart.entity.Product;
import com.smartcart.entity.Role;
import com.smartcart.entity.User;
import com.smartcart.repository.ProductRepository;
import com.smartcart.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
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
            user.setEmail("user@smartcart.com");
            user.setPassword(passwordEncoder.encode("password123"));
            user.setRole(Role.USER);
            userRepository.save(user);

            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@smartcart.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }
    }

    private void seedProducts() {
        // Ensure ALL stitch products exist in the database
        createIfMissing("Tactile K1 Pro", "Low-profile mechanical switches.", "189.00", "Accessories", "https://lh3.googleusercontent.com/aida-public/AB6AXuAEktiuvQkljEPjHz9LtP5M-T-Okj8OiNQVqjj_cXuDtXg_FVtI3KwL1gzu1v3PkHw1qDKYFEKtcqHqv9HeYjk_nLuUdHwTJ6Q7fiTxZMw_8ku6Ellr_8FfZD8FJ9dNLXAapKS3mB4oW7XiC-61o0HJBaWQswMVBKcaNEUM39soAo_pEGVY4PXv0zcRqWVcwfLtLnq9-E44VCXKKgAHOAnxgrGAR4XPEj5QVZytvfD7T0gTal0fQnVIME7LNWBXKBS3JHaUgVXSKRUc");
        createIfMissing("Aura Chrono II", "Titanium build, 14-day battery.", "420.00", "Wearables", "https://lh3.googleusercontent.com/aida-public/AB6AXuCNkyHUOnkld4U92wNgjffGbK9b424LX082_J1qV3HW6Y76jMHJfWFSlSnJ_9oM7eWnFy0Tb8bFtpkuPgri3_3agT8NgX0RcTQ68wcl2uQdAYFsTQxMLajTrIp3tIxmmBNaBqZLsKHvVtiCTdbYcUW9MAwYWct_Z0JBaRzvXZ93-NT1IGSYo17UWZXqXB1aTHmfTxel2MQo1L_yrJK_3yvD6RXJUxt08eXMnRQkZEfMWph-hYbXDYLSjbxYlWT2lD_iohivjXpGsmzT");
        createIfMissing("Apex Glide", "Ultra-lightweight wireless precision.", "129.00", "Accessories", "https://lh3.googleusercontent.com/aida-public/AB6AXuBScZ6482Do0eQApDTRZOzQvt0m3ZFf6-oTtiSGtoEIDz0hr16WXhRsws83IqBZRD0q0dsDk_G47pbBtVxzaIUPa_WPgc6npH0bU5fwN1vOYmYusZeV5YMkEmxxj_FOXEjj4NBI-YxwIk5cq4mi3TVmi4dXrb5Y4Nk6MLiiUa6XZ80oiVnWbr1_4qNEgV9ljoeToL4kNdByO_-mcA5BP4gpniPj2CP4fDiheOkVv4wXcIauk6HUHGQ4WMEwsLLdznT8_eVDYyVkNQCl");
        createIfMissing("Nexus X", "Bezel-less OLED, AI processing.", "999.00", "Electronics", "https://lh3.googleusercontent.com/aida-public/AB6AXuDLzn_mQwDYZe0l79z9FvIr0xvEOU0uwkhlfMlg9RHFFGqK4FFzhH6scn5xDoPQXJ1JkA2gv8zoMlLG32pwmyDJkz808VCgCIafVqaX70n_TrFZMD0WDF9lkrRQRDnRpErqaRS4aw5J-tKhtmPlsV057PzN5j7EdaI_tqGvFQxQIO9QyDcO7Ovh-BQ2mVQnAWpVBex2HbMNut4dE5zAMkZrduItM1RxQMs-ATzqxShi1AxdEef6LO4Q2asTa_jBmE7Chy98Iky8T6GT");
        createIfMissing("Sonic Pro ANC", "Immersive sound, AI curated.", "349.00", "Audio", "https://lh3.googleusercontent.com/aida-public/AB6AXuADwD3hc2shlEF2on5TOJLKfmmn00bgIyeIvwROmHkuwMFok3pvMWKs8dzWQRofv2NBbWAk6P-MgQOtsAEKRSFFtzfgRUK5qG-a-bL49_ojJoUvHeRrhCA-DM7XkgLmgSL-IRkHKgoBr5FGEQWTmVpCfQby_5XwLVoe68HWIEGJX-_B7AEYhSWWYTMW6lJoW4ARulOb2IRhMRYJ6xE3Ai3CrNVj-Jh1Qzto4u4_zUpB-JdcylX0tjhBBdcqFPpnT7L9w111O3mtvTaH");
        createIfMissing("Immersive Soundscapes Earbuds", "Flagship spatial audio collection earbuds.", "250.00", "Audio", "https://lh3.googleusercontent.com/aida-public/AB6AXuBVMiCBTTHmDOIsOcZo507FV3GGXe-n_v8Ge6tQdudwsGO0Q-nmBKoKcguEC4Nc_j6KJ6Y7WykAWx1rQ3SRWqdz_jBPvybcZI7PWPswhCztskhgbp10pTN6FA1BGjOSe7HvFRpikmeT5zSxRTw0E93M1ccuFt7VMpXFox6_LvXqXN4nrdFP2ne3uUXY5HblK0OE60TAuFY8wUfMsWMkYrScMga3baas9N1nuVH2t6298EZrvvRaVVQuB9_OOAZaAIFUV5wViiRRhqxZ");
        createIfMissing("Vital Tracker Ring", "Invisible health monitoring smart ring.", "199.00", "Wearables", "https://lh3.googleusercontent.com/aida-public/AB6AXuDdvNbBqmoKKP0p5d_mcqUTgwbjedKCojtBLYIZ8VDpJ6SyAjFrqaogWz8nHFalYzFxyfxSvB_kXvYjGGscEVvqOC-tBFYfQN943CsCr0Chwwy43wX6U0USTtaeE9H6LRiQRHaw6zChXkUuttNPwamUT43TLV84E2bAmjMy5PFgkq48JJ21LgaZi7MEzwvxWtumWHvrqpztpOTlMt0M7NRnMLamfVS5cTBtEc379c5R8I-13AW2iaJ91eY6fP5IgolBwZAsRBaY8xdF");
        createIfMissing("Lumina Sync", "Ambient intelligence for your studio.", "99.00", "Smart Home", "/images/products/lumina-sync.jpg");

        // 11 Newly Uploaded Premium Products
        createIfMissing("Voltix 20K FastCharge Powerbank", "Compact high-speed charging solution designed for modern devices and travel. | Specs: 20000mAh Battery, 22.5W Fast Charging, USB-C PD, Dual Output", "69.00", "Accessories", "/images/products/powerbank.png");
        createIfMissing("CyberKeys K75 Mechanical Keyboard", "Gasket-mounted 75% mechanical keyboard with hot-swappable tactile switches and vivid per-key RGB. | Specs: 75% Layout, Gasket Mounted, Hot-Swappable Switches, Wireless 2.4GHz & BT", "149.00", "Electronics", "/images/products/mechanical-keyboard.png");
        createIfMissing("Apex Control Wireless Gamepad", "Precision pro wireless controller featuring Hall Effect analog sticks, mechanical tactile buttons, and custom profiles. | Specs: Hall Effect Sticks, Mechanical Switches, 4 Back Paddles, Low Latency", "79.00", "Electronics", "/images/products/gaming-controller.png");
        createIfMissing("ChronoMax Sapphire Smartwatch", "High-end smartwatch built with a circular sapphire glass display, titanium chassis, and advanced health monitoring. | Specs: Sapphire Glass Display, Titanium Chassis, 14-Day Battery, ECG & Heart Rate Monitor", "299.00", "Wearables", "/images/products/smartwatch.png");
        createIfMissing("FrostStream Ergonomic Cooling Stand", "Ergonomic laptop cooling stand with a sleek aluminum frame and integrated quiet-running performance fans. | Specs: Aluminum Frame, Dual Quiet Fans, 5 Height Angles, Integrated USB Hub", "45.00", "Electronics", "/images/products/cooling-pad.png");
        createIfMissing("VoltCharge 100W GaN Wall Charger", "High-speed 100W GaN wall charger featuring multiple USB-C and USB-A ports to charge all your devices simultaneously. | Specs: 100W GaN Technology, 3x USB-C PD Ports, 1x USB-A QC, Smart Power Distribution", "59.00", "Accessories", "/images/products/usb-charger.png");
        createIfMissing("SpectraVision 27\" 4K Pro Monitor", "Professional 27-inch 4K UHD monitor with ultra-thin bezels, factory-calibrated color accuracy, and USB-C connectivity. | Specs: 27\" IPS 4K UHD, 99% sRGB Color, Bezel-Less Design, USB-C 65W Power Delivery", "449.00", "Smart Home", "/images/products/monitor.png");
        createIfMissing("HyperGlide Wireless Gaming Mouse", "Ultra-lightweight wireless gaming mouse with a 26K DPI optical sensor, optical switches, and ergonomic grip. | Specs: 26,000 DPI Sensor, 60g Lightweight, Optical Switches, Lag-Free Wireless", "89.00", "Electronics", "/images/products/gaming-mouse.png");
        createIfMissing("SonicBuds Pro Spatial Audio Earbuds", "Premium wireless earbuds featuring active noise cancellation, custom dynamic drivers, and a matte black charging case. | Specs: Active Noise Cancellation, 3D Spatial Audio, 32h Battery Life, IPX5 Sweatproof", "129.00", "Audio", "/images/products/earbuds.png");
        createIfMissing("BaseStation Wireless Headphone Stand", "Unique desktop headphone stand crafted with premium materials and an integrated 15W Qi wireless charger base. | Specs: Aluminum Support Arm, 15W Qi Wireless Base, Dual USB Ports, Premium Textured Accent", "79.00", "Accessories", "/images/products/headphone-stand.png");
        createIfMissing("ErgoSplit Low-Profile Keyboard", "Ergonomic split mechanical keyboard designed with a low-profile aluminum case, linear switches, and comfortable wrist rest. | Specs: Fully Split Design, Low-Profile Linear Switches, Aluminum Body, Ergonomic Tilt Tents", "199.00", "Electronics", "/images/products/split-keyboard.png");
    }

    private void createIfMissing(String name, String desc, String price, String cat, String img) {
        Optional<Product> existing = productRepository.findAll().stream()
                .filter(p -> p.getName().equals(name))
                .findFirst();

        if (existing.isEmpty()) {
            Product product = new Product(null, name, desc, new BigDecimal(price), BigDecimal.ZERO, 50, cat, img, null);
            productRepository.save(product);
            System.out.println("Created new Stitch product: " + name);
        } else {
            Product product = existing.get();
            if (!img.equals(product.getImageUrl())) {
                product.setImageUrl(img);
                productRepository.save(product);
                System.out.println("Updated image for Stitch product: " + name);
            }
        }
    }
}
