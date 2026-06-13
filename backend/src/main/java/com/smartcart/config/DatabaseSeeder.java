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

        seedProduct("Nova Sonic ANC", "NOVA", "Premium wireless headphones engineered for immersive audio, all-day comfort, and intelligent noise cancellation. | Specs: Bluetooth Version: 5.3, Battery Life: 40 Hours, Driver Size: 40mm, Noise Cancellation: Active ANC (45dB), Charging Type: USB-C Quick Charge", "9999.00", "Audio", "/images/products/audio gear/hp 1.jpg", 4.6, 120);
        seedProduct("Nova Echo Air", "NOVA", "Ultra-lightweight wireless earbuds designed for active lifestyles and crystal clear calls. | Specs: Bluetooth Version: 5.4, Battery Life: 32 Hours, Driver Size: 11mm, Noise Cancellation: Hybrid ANC (40dB), Charging Type: USB-C", "4999.00", "Audio", "/images/products/audio gear/earbuds.jpg", 4.4, 250);
        seedProduct("Nova Pulse ANC", "NOVA", "Over-ear hybrid active noise cancelling headphones for your daily commute and deep focus. | Specs: Bluetooth Version: 5.3, Battery Life: 50 Hours, Driver Size: 40mm, Noise Cancellation: Hybrid ANC (43dB), Charging Type: USB-C Quick Charge", "7999.00", "Audio", "/images/products/audio gear/hp2.jpg", 4.5, 150);
        seedProduct("Nova Resonance Pro", "NOVA", "Flagship audiophile over-ear headphones with custom hybrid dynamic drivers and premium memory foam cushions. | Specs: Bluetooth Version: 5.3, Battery Life: 45 Hours, Driver Size: 45mm, Noise Cancellation: Hybrid ANC (48dB), Charging Type: Qi Wireless + USB-C", "14999.00", "Audio", "/images/products/audio gear/hp3.jpg", 4.8, 80);
        seedProduct("Nova Wave Studio", "NOVA", "High-resolution reference studio headphones designed for professional audio mixing and mastering. | Specs: Bluetooth Version: Wired Only, Battery Life: N/A, Driver Size: 50mm, Noise Cancellation: Passive Isolation, Charging Type: N/A", "18999.00", "Audio", "/images/products/audio gear/hp4.jpg", 4.9, 45);
        seedProduct("Nova Orbit Max", "NOVA", "Premium luxury spatial audio headphones featuring magnetic earcups and reactive head-tracking technology. | Specs: Bluetooth Version: 5.4, Battery Life: 30 Hours, Driver Size: 40mm Dual-Diaphragm, Noise Cancellation: Smart Adaptive ANC (50dB), Charging Type: USB-C Fast Charge", "24999.00", "Audio", "/images/products/audio gear/earbuds 1.jpg", 4.9, 30);
        seedProduct("Nova AeroBeat", "NOVA", "Durable neckband designed for workout sessions, featuring magnetic earbuds and fast pairing. | Specs: Bluetooth Version: 5.2, Battery Life: 24 Hours, Driver Size: 10mm, Noise Cancellation: Environmental Noise Cancellation (ENC), Charging Type: USB-C", "2499.00", "Audio", "/images/products/audio gear/earbuds 2.jpg", 4.1, 350);
        seedProduct("Nova SyncPods Elite", "NOVA", "Next-generation wireless earbuds with customised touch controls and low latency gaming mode. | Specs: Bluetooth Version: 5.3, Battery Life: 36 Hours, Driver Size: 12mm, Noise Cancellation: Smart ANC (42dB), Charging Type: Qi Wireless + USB-C", "6999.00", "Audio", "/images/products/audio gear/earbuds 3.jpg", 4.5, 200);
        seedProduct("Nova Soundstage Pro", "NOVA", "Premium TV soundbar with integrated subwoofers and cinematic Dolby Atmos support. | Specs: Bluetooth Version: 5.0 + HDMI eARC, Battery Life: AC Powered, Driver Size: Quad 3-inch + Dual Tweeters, Noise Cancellation: N/A, Charging Type: AC Power Cord", "16999.00", "Audio", "/images/products/audio gear/speaker.jpg", 4.7, 60);
        seedProduct("Nova StreamCast Mic", "NOVA", "Professional cardioid condenser microphone with built-in pop filter and custom RGB gain dial. | Specs: Bluetooth Version: USB Connection, Battery Life: USB Powered, Driver Size: 16mm Condenser Capsule, Noise Cancellation: Real-time Noise Reduction, Charging Type: USB-C", "5999.00", "Audio", "/images/products/audio gear/hp5.jpg", 4.6, 110);
        seedProduct("Nova EchoSphere Speaker", "NOVA", "Omnidirectional 360-degree smart home speaker with premium acoustic fabric and bass radiators. | Specs: Bluetooth Version: 5.3 + Wi-Fi, Battery Life: 15 Hours, Driver Size: 3.5-inch Woofer, Noise Cancellation: Room Correction, Charging Type: DC Adapter / USB-C", "8999.00", "Audio", "/images/products/audio gear/speaker1.jpg", 4.5, 90);
        seedProduct("Nova RaveBox", "NOVA", "Rugged outdoor waterproof Bluetooth speaker with dynamic synced LED rings. | Specs: Bluetooth Version: 5.3, Battery Life: 24 Hours, Driver Size: Dual 4-inch Woofers, Noise Cancellation: N/A, Charging Type: USB-C PD", "11999.00", "Audio", "/images/products/audio gear/speaker2.jpg", 4.6, 140);
        seedProduct("Nova Monitor 5", "NOVA", "Active near-field reference monitors for music producers and video editors (sold as pair). | Specs: Bluetooth Version: TRS/XLR Balanced, Battery Life: AC Powered, Driver Size: 5.25-inch Kevlar, Noise Cancellation: N/A, Charging Type: Dual AC Power", "21999.00", "Audio", "/images/products/audio gear/speaker3.jpg", 4.8, 35);
        seedProduct("Nova PurePods", "NOVA", "Comfort-first true wireless earbuds with touch interface and water-resistant nano coating. | Specs: Bluetooth Version: 5.2, Battery Life: 28 Hours, Driver Size: 10mm, Noise Cancellation: ENC for Calls, Charging Type: USB-C", "3999.00", "Audio", "/images/products/audio gear/earbuds 4.jpg", 4.2, 300);
        seedProduct("Nova AirFlow", "NOVA", "Open-ear bone conduction headphones for safe outdoor athletics and ambient awareness. | Specs: Bluetooth Version: 5.3, Battery Life: 10 Hours, Driver Size: Bone Conduction, Noise Cancellation: Open-Ear Design, Charging Type: Magnetic Dock", "5499.00", "Audio", "/images/products/audio gear/earbuds 5.jpg", 4.3, 180);
        seedProduct("Nova Clarity Bud", "NOVA", "High-end earbuds featuring triple-mic voice pickup and advanced transparency mode. | Specs: Bluetooth Version: 5.4, Battery Life: 40 Hours, Driver Size: 11mm Dynamic, Noise Cancellation: Hybrid ANC (45dB), Charging Type: Qi Wireless + USB-C", "8499.00", "Audio", "/images/products/audio gear/earbuds 6.jpg", 4.7, 160);
        seedProduct("Nova Symphony One", "NOVA", "Premium over-ear headphones with custom carbon-fibre drivers and adaptive noise-cancelling engine. | Specs: Bluetooth Version: 5.3, Battery Life: 38 Hours, Driver Size: 40mm Carbon-fibre, Noise Cancellation: Adaptive ANC (46dB), Charging Type: USB-C", "12999.00", "Audio", "/images/products/earbuds.png", 4.7, 95);
        seedProduct("Nova BeatBuds", "NOVA", "Affordable true wireless earbuds with deep bass booster and smart touch controls. | Specs: Bluetooth Version: 5.1, Battery Life: 20 Hours, Driver Size: 8mm, Noise Cancellation: Passive, Charging Type: USB-C", "1999.00", "Audio", "/images/products/audio gear/earbuds.jpg", 4, 400);
        seedProduct("Nova Horizon Watch", "NOVA", "Elegant everyday smartwatch featuring a bright curved AMOLED display and detailed lifestyle tracking. | Specs: Display Type: 1.43-inch AMOLED, Battery Life: 14 Days, Water Resistance: 5ATM, Sensors: Heart Rate & SpO2, Compatibility: iOS & Android", "7999.00", "Wearables", "/images/products/wearables/smartwatch.png", 4.5, 130);
        seedProduct("Nova Apex Fit", "NOVA", "Sleek fitness band optimised for activity logging, workout tracking, and posture notifications. | Specs: Display Type: 1.62-inch OLED, Battery Life: 10 Days, Water Resistance: IP68, Sensors: 6-Axis Motion Sensor, Compatibility: iOS & Android", "3499.00", "Wearables", "/images/products/wearables/sw.jpg", 4.3, 210);
        seedProduct("Nova Chronos X", "NOVA", "Tactical rugged outdoor smartwatch built with sapphire glass and aerospace titanium. | Specs: Display Type: 1.5-inch Sapphire Glass, Battery Life: 7 Days, Water Resistance: 10ATM, Sensors: GPS & Altimeter, Compatibility: iOS & Android", "16999.00", "Wearables", "/images/products/wearables/sw 1.jpg", 4.8, 75);
        seedProduct("Nova Motion Pro", "NOVA", "Smart health tracker with active heart rate monitoring and guided breathing exercises. | Specs: Display Type: 1.78-inch LCD, Battery Life: 8 Days, Water Resistance: IP68, Sensors: Accelerometer, Compatibility: iOS & Android", "4499.00", "Wearables", "/images/products/wearables/sw2.jpg", 4.2, 175);
        seedProduct("Nova Elevate Ultra", "NOVA", "Premium wellness watch equipped with advanced ECG measurement and skin temperature sensors. | Specs: Display Type: 1.4-inch Curved AMOLED, Battery Life: 12 Days, Water Resistance: 5ATM, Sensors: Blood Pressure & SpO2, Compatibility: iOS & Android", "12999.00", "Wearables", "/images/products/wearables/sw3.jpg", 4.6, 90);
        seedProduct("Nova Active Pulse", "NOVA", "Lightweight sports tracker band with automatic workout detection and daily step counter. | Specs: Display Type: 1.3-inch TFT, Battery Life: 5 Days, Water Resistance: IP67, Sensors: Sleep Tracker, Compatibility: iOS & Android", "1999.00", "Wearables", "/images/products/wearables/sw4.jpg", 3.9, 300);
        seedProduct("Nova Zenith Watch", "NOVA", "Flagship lifestyle smartwatch with micro-bezel display, gesture controls, and standalone GPS. | Specs: Display Type: 1.43-inch AMOLED, Battery Life: 15 Days, Water Resistance: 5ATM, Sensors: Stress Tracker & Compass, Compatibility: iOS & Android", "9999.00", "Wearables", "/images/products/wearables/sw5.jpg", 4.7, 110);
        seedProduct("Nova Aura Ring", "NOVA", "Ultra-discreet smart ring crafted from titanium for continuous health, sleep, and HRV tracking. | Specs: Display Type: N/A (Smart Ring), Battery Life: 6 Days, Water Resistance: 50m, Sensors: Temp & HRV, Compatibility: iOS & Android", "18999.00", "Wearables", "/images/products/wearables/smart ring.jpg", 4.6, 60);
        seedProduct("Nova FitBand Lite", "NOVA", "Minimalist health band with sleep monitoring and phone notifications. | Specs: Display Type: 1.1-inch AMOLED, Battery Life: 20 Days, Water Resistance: 5ATM, Sensors: Optical Heart Rate, Compatibility: iOS & Android", "2499.00", "Wearables", "/images/products/wearables/sw6.jpg", 4.1, 280);
        seedProduct("Nova Aero Tracker", "NOVA", "Stylish active watch with customised sports profiles and daily calories calculator. | Specs: Display Type: 1.39-inch AMOLED, Battery Life: 10 Days, Water Resistance: IP68, Sensors: Gyrometer, Compatibility: iOS & Android", "5999.00", "Wearables", "/images/products/wearables/sw7.jpg", 4.4, 150);
        seedProduct("Nova Chronos Classic", "NOVA", "Circular classic watch design with leather straps and smart activity widgets. | Specs: Display Type: 1.32-inch Circular LCD, Battery Life: 12 Days, Water Resistance: 3ATM, Sensors: Heart Rate, Compatibility: iOS & Android", "6999.00", "Wearables", "/images/products/wearables/sw8.jpg", 4.3, 140);
        seedProduct("Nova Horizon Lite", "NOVA", "Budget-friendly smart companion with multiple watch faces and sedentary alerts. | Specs: Display Type: 1.69-inch TFT, Battery Life: 9 Days, Water Resistance: IP68, Sensors: Sleep & Heart Rate, Compatibility: iOS & Android", "2999.00", "Wearables", "/images/products/wearables/sw9.jpg", 4, 220);
        seedProduct("Nova Luxe Smartwatch", "NOVA", "Ultimate luxury wearable with hand-polished ceramic finish and customised dials. | Specs: Display Type: 1.43-inch AMOLED Titanium, Battery Life: 5 Days, Water Resistance: 5ATM, Sensors: ECG & Stress, Compatibility: iOS & Android", "21999.00", "Wearables", "/images/products/wearables/smartwatch.png", 4.9, 40);
        seedProduct("Nova Ring Pro", "NOVA", "Premium grade smart health ring with optimised battery and brushed gold finish. | Specs: Display Type: N/A (Titanium Ring), Battery Life: 7 Days, Water Resistance: 100m, Sensors: Core Temp & SpO2, Compatibility: iOS & Android", "23999.00", "Wearables", "/images/products/wearables/tech ring.jpg", 4.8, 50);
        seedProduct("Nova Zenith Fit", "NOVA", "Action smartwatch featuring track metrics navigation and elevation sensors. | Specs: Display Type: 1.4-inch AMOLED, Battery Life: 14 Days, Water Resistance: 5ATM, Sensors: GPS & Altimeter, Compatibility: iOS & Android", "11999.00", "Wearables", "/images/products/wearables/sw.jpg", 4.6, 95);
        seedProduct("Nova Phantom Controller", "NOVA", "Wireless gamepad with Hall Effect joysticks and customisable mechanical action buttons. | Specs: Connectivity: 2.4GHz Wireless / BT / Wired, RGB Support: Yes (Custom Profile), Polling Rate: 250Hz, Battery: 10 Hours, Compatibility: PC / Xbox / Switch", "4999.00", "Electronics", "/images/products/gaming/controller.jpg", 4.5, 180);
        seedProduct("Nova Titan RGB Keyboard", "NOVA", "Solid aluminium mechanical keyboard equipped with custom hot-swappable linear switches. | Specs: Connectivity: Wired USB-C, RGB Support: Per-Key RGB (16.8M colors), Polling Rate: 1000Hz, Battery: Wired, Compatibility: Windows / macOS", "11999.00", "Electronics", "/images/products/gaming/keyboard.jpg", 4.7, 85);
        seedProduct("Nova Vortex Mouse", "NOVA", "Ergonomic gaming mouse featuring a high-performance 26K optical sensor and PTFE feet. | Specs: Connectivity: Lag-free Wireless / Wired, RGB Support: Dynamic Accent RGB, Polling Rate: 1000Hz, Battery: 60 Hours, Compatibility: Windows / macOS", "5999.00", "Electronics", "/images/products/gaming/mouse.jpg", 4.6, 140);
        seedProduct("Nova Strike Elite Mouse", "NOVA", "Budget gaming mouse with durable switches and a lightweight honeycomb design. | Specs: Connectivity: Wired USB, RGB Support: Static RGB Strip, Polling Rate: 500Hz, Battery: Wired, Compatibility: Windows / macOS", "1999.00", "Electronics", "/images/products/gaming/mouse1.jpg", 4.1, 250);
        seedProduct("Nova Velocity Pro Keyboard", "NOVA", "Low-profile wireless mechanical keyboard with quiet tactile switches and travel cover. | Specs: Connectivity: Wireless 2.4GHz + BT, RGB Support: RGB Backlit, Polling Rate: 1000Hz, Battery: 120 Hours (RGB Off), Compatibility: Windows / macOS / Android", "8999.00", "Electronics", "/images/products/gaming/keyboard1.jpg", 4.5, 110);
        seedProduct("Nova Arena Hub Controller", "NOVA", "Pro controller featuring rear remappable paddles and adjustable trigger stops. | Specs: Connectivity: Wired USB-C, RGB Support: Halo Ring RGB, Polling Rate: 500Hz, Battery: Wired, Compatibility: PC / PS5 / Xbox", "6999.00", "Electronics", "/images/products/gaming/controller1.jpg", 4.6, 120);
        seedProduct("Nova CyberKeys K75", "NOVA", "Gasket-mounted 75% mechanical keyboard with retro keycaps and linear silent switches. | Specs: Connectivity: Wireless 2.4GHz & BT, RGB Support: Per-key RGB, Polling Rate: 1000Hz, Battery: 80 Hours, Compatibility: Windows / macOS / iOS", "9999.00", "Electronics", "/images/products/gaming/keyboard2.jpg", 4.7, 95);
        seedProduct("Nova HyperGlide Mouse", "NOVA", "Ultra-lightweight gaming mouse weighing only 58g for fast reflexes and FPS games. | Specs: Connectivity: 2.4GHz Wireless, RGB Support: Logo Accent, Polling Rate: 1000Hz, Battery: 50 Hours, Compatibility: Windows / macOS", "6499.00", "Electronics", "/images/products/gaming/mouse2.jpg", 4.5, 160);
        seedProduct("Nova ErgoSplit Keyboard", "NOVA", "Split mechanical keyboard for ergonomic gaming and long-session typing comfort. | Specs: Connectivity: Split Type-C / Wireless, RGB Support: Underglow RGB, Polling Rate: 1000Hz, Battery: 100 Hours, Compatibility: Windows / macOS / Linux", "14999.00", "Electronics", "/images/products/gaming/keyboard3.jpg", 4.8, 55);
        seedProduct("Nova Apex Control Pad", "NOVA", "Mobile gaming controller with telescopic design and mechanical switches. | Specs: Connectivity: Bluetooth 5.1 / Wired, RGB Support: Dual-zone RGB, Polling Rate: 250Hz, Battery: 12 Hours, Compatibility: PC / Mobile / Switch", "3999.00", "Electronics", "/images/products/gaming/controller2.jpg", 4.3, 200);
        seedProduct("Nova Aegis Gaming Headset", "NOVA", "Wireless gaming headset with 7.1 spatial surround audio and a retractable mic. | Specs: Connectivity: 2.4GHz Wireless / 3.5mm, RGB Support: Earcap LED, Polling Rate: N/A, Battery: 30 Hours, Compatibility: PC / PS5 / Switch", "7999.00", "Electronics", "/images/products/gaming/gaming headset.jpg", 4.4, 115);
        seedProduct("Nova SpectraVision 27", "NOVA", "27-inch IPS gaming monitor with 165Hz refresh rate and ultra-thin bezels. | Specs: Connectivity: DisplayPort / Dual HDMI / USB-C, RGB Support: Rear Ambient Glow, Polling Rate: 165Hz Refresh Rate, Battery: AC Powered, Compatibility: PC / Consoles", "19999.00", "Electronics", "/images/products/monitor.png", 4.7, 50);
        seedProduct("Nova Phantom Mouse", "NOVA", "Ambidextrous wireless gaming mouse featuring mechanical switch customisation. | Specs: Connectivity: Ultra-light Wireless, RGB Support: Minimalist RGB, Polling Rate: 2000Hz, Battery: 45 Hours, Compatibility: Windows / macOS", "5499.00", "Electronics", "/images/products/gaming/mouse3.jpg", 4.4, 140);
        seedProduct("Nova Strike Mechanical", "NOVA", "Entry-level mechanical keyboard with blue clicky switches and double-shot keycaps. | Specs: Connectivity: Wired, RGB Support: Rainbow Backlit, Polling Rate: 1000Hz, Battery: Wired, Compatibility: Windows / macOS", "3999.00", "Electronics", "/images/products/gaming/keyboard4.jpg", 4.2, 190);
        seedProduct("Nova Gladiator Arcade", "NOVA", "Classic arcade fightstick featuring authentic Sanwa parts and customisable template. | Specs: Connectivity: USB Wired, RGB Support: Button LED Rings, Polling Rate: 1000Hz, Battery: Wired, Compatibility: PC / PS4 / Switch", "8999.00", "Electronics", "/images/products/gaming/gaming-controller.png", 4.6, 65);
        seedProduct("Nova Home Core Hub", "NOVA", "Central smart home hub connecting all Zigbee and Thread smart devices locally. | Specs: Connectivity: Wi-Fi 6, Zigbee, Thread, Smart Assistant Support: Google Assistant & Alexa, Power Usage: 15W, Range: Up to 1500 sq ft", "5999.00", "Smart Home", "/images/products/smart-device/Central smart home hub connecting all Zigbee and Thread smart devices locally..jpg", 4.5, 90);
        seedProduct("Nova Lumina Lightstrip", "NOVA", "Smart flexible lightstrip offering 16 million colours with dynamic audio sync. | Specs: Connectivity: Wi-Fi 2.4GHz, Smart Assistant Support: Google & Alexa, Power Usage: 24W, Range: Smart Cloud Control", "2499.00", "Smart Home", "/images/products/smart-device/Smart flexible lightstrip offering 16 million colours with dynamic audio sync..jpg", 4.2, 220);
        seedProduct("Nova Guardian Cam", "NOVA", "Indoor 2K security camera with intelligent AI detection and pan-tilt rotation. | Specs: Connectivity: Wi-Fi 2.4GHz / 5GHz, Smart Assistant Support: Alexa & Google Assistant, Power Usage: 5W (USB Powered), Range: 30ft Night Vision", "3999.00", "Smart Home", "/images/products/smart-device/Nova Guardian Cam.jpg", 4.4, 150);
        seedProduct("Nova Sense Mini Sensor", "NOVA", "Compact motion sensor detecting movement up to 7 metres with 170-degree range. | Specs: Connectivity: Zigbee 3.0, Smart Assistant Support: SmartHub Integrated, Power Usage: CR2032 Battery, Range: 80ft to Hub", "1299.00", "Smart Home", "/images/products/smart-device/Precision temperature and humidity sensor triggering automatic HVAC rules..jpg", 4.1, 400);
        seedProduct("Nova Smart Plug Pro", "NOVA", "Compact smart plug with power consumption monitoring and scheduled timers. | Specs: Connectivity: Wi-Fi 2.4GHz, Smart Assistant Support: Alexa & Google, Power Usage: Max 10A / 1200W, Range: Smart Cloud Control", "1499.00", "Smart Home", "/images/products/smart-device/Compact smart plug with power consumption monitoring and scheduled timers..jpg", 4.3, 310);
        seedProduct("Nova Guardian Cam Outdoor", "NOVA", "Weather-proof wireless outdoor camera with rechargeable battery and solar panel support. | Specs: Connectivity: Wi-Fi + Rechargeable Battery, Smart Assistant Support: Alexa & Google, Power Usage: Internal Battery (6 Months), Range: 50ft Night Vision", "6999.00", "Smart Home", "/images/products/smart-device/Weather-proof wireless outdoor camera with rechargeable battery and solar panel support..jpg", 4.5, 110);
        seedProduct("Nova Lumina Smart Bulb", "NOVA", "Smart LED bulb with colour temperature controls and custom lighting scenes. | Specs: Connectivity: Bluetooth & Wi-Fi, Smart Assistant Support: Google & Alexa, Power Usage: 9W (60W Equiv), Range: Smart Cloud Control", "999.00", "Smart Home", "/images/products/lumina-sync.jpg", 4.1, 500);
        seedProduct("Nova Sense Temp Sensor", "NOVA", "Precision temperature and humidity sensor triggering automatic HVAC rules. | Specs: Connectivity: Bluetooth LE / Zigbee, Smart Assistant Support: Home Core Compatible, Power Usage: CR2450 Battery, Range: 100ft", "1199.00", "Smart Home", "/images/products/smart-device/Precision temperature and humidity sensor triggering automatic HVAC rules..jpg", 4.2, 350);
        seedProduct("Nova Smart Thermostat", "NOVA", "Intelligent thermostat featuring automatic schedule learning and geofencing. | Specs: Connectivity: Wi-Fi 2.4GHz, Smart Assistant Support: Alexa & Google, Power Usage: 24V C-Wire, Range: Smart Cloud Control", "14999.00", "Smart Home", "/images/products/smart-device/Intelligent thermostat featuring automatic schedule learning and geofencing..jpg", 4.6, 65);
        seedProduct("Nova Smart Lock Pro", "NOVA", "Retrofit smart lock supporting keyless entry, codes, and fingerprint access. | Specs: Connectivity: Wi-Fi & Bluetooth, Smart Assistant Support: Alexa & Google, Power Usage: 4 AA Batteries, Range: Bluetooth range / Cloud", "12999.00", "Smart Home", "/images/products/smart-device/Retrofit smart lock supporting keyless entry, codes, and fingerprint access..jpg", 4.7, 80);
        seedProduct("Nova Guardian Video Doorbell", "NOVA", "Smart doorbell featuring two-way audio, custom quick replies, and human detection. | Specs: Connectivity: Wi-Fi 2.4GHz, Smart Assistant Support: Alexa & Google, Power Usage: Hardwired / Battery, Range: 30ft Motion Detection", "8999.00", "Smart Home", "/images/products/smart-device/Smart doorbell featuring two-way audio, custom quick replies, and human detection..jpg", 4.5, 100);
        seedProduct("Nova Lumina Ceiling Panel", "NOVA", "Modern flush-mount ambient smart ceiling panel with adjustable white tones. | Specs: Connectivity: Wi-Fi 2.4GHz, Smart Assistant Support: Alexa & Google, Power Usage: 36W, Range: Dynamic Room Coverage", "7999.00", "Smart Home", "/images/products/smart-device/Modern flush-mount ambient smart ceiling panel with adjustable white tones..jpg", 4.4, 70);
        seedProduct("Nova Flow Water Valve", "NOVA", "Smart water main shutoff valve controller with automated leak detection routines. | Specs: Connectivity: Zigbee / Wi-Fi, Smart Assistant Support: Alexa & Google, Power Usage: 12V DC Adapter, Range: 120ft to Hub", "9999.00", "Smart Home", "/images/products/smart-device/Smart water main shutoff valve controller with automated leak detection routines..jpg", 4.6, 55);
        seedProduct("Nova Aura Humidifier", "NOVA", "Smart ultrasonic humidifier with adjustable mist settings and essential oil tray. | Specs: Connectivity: Wi-Fi 2.4GHz, Smart Assistant Support: Alexa & Google, Power Usage: 30W, Range: Up to 350 sq ft", "4999.00", "Smart Home", "/images/products/smart-device/Smart ultrasonic humidifier with adjustable mist settings and essential oil tray..jpg", 4.3, 130);
        seedProduct("Nova Guard Smoke Detector", "NOVA", "Interlinked smart smoke and carbon monoxide detector sending real-time alerts. | Specs: Connectivity: Wi-Fi / Interlinked, Smart Assistant Support: Phone Alerts, Power Usage: 10-Year Lithium Battery, Range: Whole-House Interlink", "3499.00", "Smart Home", "/images/products/smart-device/smoke detecotr.jpg", 4.5, 160);
        seedProduct("Nova Charge 65", "NOVA", "Ultra-compact GaN fast wall charger with dual USB-C ports and power distribution. | Specs: Wattage: 65W GaN Fast Charge, Cable Length: N/A, Material: Fireproof PC, Charging Standard: PD 3.0 / QC 4.0 / PPS", "2999.00", "Accessories", "/images/products/accessories/charger4.jpg", 4.6, 220);
        seedProduct("Nova FlexLink Cable", "NOVA", "Double-braided high durability nylon USB-C to USB-C charging and data cable. | Specs: Wattage: 100W USB-C PD, Cable Length: 2 Metres (6.6 ft), Material: Double-Braided Premium Nylon, Charging Standard: USB 2.0 / PD 3.0", "999.00", "Accessories", "/images/products/accessories/cable.jpg", 4.4, 450);
        seedProduct("Nova PowerVault 10K", "NOVA", "Slim aluminium power bank featuring 22.5W fast charging and dual output. | Specs: Wattage: 22.5W Output / 18W Input, Cable Length: 0.3m Cable Included, Material: Brushed Aluminium, Charging Standard: PD 3.0 & QC 3.0", "1999.00", "Accessories", "/images/products/accessories/powerbank.png", 4.3, 300);
        seedProduct("Nova Dock Pro", "NOVA", "8-in-1 USB-C docking station with 4K HDMI, SD card reader, and Power Delivery. | Specs: Wattage: 85W Pass-Through Charging, Cable Length: 0.5m Host Cable, Material: Anodised Aluminium, Charging Standard: Thunderbolt 3 / USB-C", "5999.00", "Accessories", "/images/products/accessories/8in1 docking station.jpg", 4.5, 120);
        seedProduct("Nova AirStand Qi", "NOVA", "Fast wireless charging stand featuring dual coil design for vertical/horizontal phone charging. | Specs: Wattage: 15W Wireless Fast Charge, Cable Length: 1.5m Cable included, Material: Zinc Alloy + Premium Fabric, Charging Standard: Qi Wireless Standard", "3499.00", "Accessories", "/images/products/accessories/5in 1 charger.jpg", 4.4, 180);
        seedProduct("Nova PowerVault 20K", "NOVA", "High capacity 20,000mAh laptop power bank with 45W USB-C Power Delivery. | Specs: Wattage: 45W Power Delivery, Cable Length: 0.5m USB-C Cable, Material: Polycarbonate, Charging Standard: PD 3.0 & QC 4.0", "3999.00", "Accessories", "/images/products/accessories/powervault.jpg", 4.6, 170);
        seedProduct("Nova Charge 100 GaN", "NOVA", "Quad-port GaN wall charger supporting multi-device charging up to 100W. | Specs: Wattage: 100W Quad-Port GaN, Cable Length: N/A, Material: Premium ABS, Charging Standard: PD 3.0 / QC 3.0 / PPS", "4999.00", "Accessories", "/images/products/accessories/charger5.jpg", 4.7, 130);
        seedProduct("Nova BaseStation Stand", "NOVA", "3-in-1 premium charging stand for phone, smartwatch, and wireless earbuds. | Specs: Wattage: 15W Wireless Stand + 5W Watch, Cable Length: 1.5m Adapter, Material: Aluminium + Leather, Charging Standard: Qi Dual Charger", "7999.00", "Accessories", "/images/products/accessories/3-in-1 premium charging stand for phone, smartwatch, and wireless earbuds.'.jpg", 4.8, 90);
        seedProduct("Nova FlexLink Micro", "NOVA", "Highly durable braided USB-A to Micro-USB cable for legacy device sync. | Specs: Wattage: 15W Charging, Cable Length: 1 Metre, Material: Braided Nylon, Charging Standard: USB-A to Micro-USB", "499.00", "Accessories", "/images/products/accessories/cable1.jpg", 4, 400);
        seedProduct("Nova MagMount Car", "NOVA", "Magnetic air-vent car mount with integrated 15W wireless fast charger. | Specs: Wattage: 15W MagSafe Wireless, Cable Length: 1.2m Charger, Material: ABS + Carbon Fibre, Charging Standard: Qi / MagSafe Compatible", "2999.00", "Accessories", "/images/products/accessories/Magnetic air-vent car mount with integrated 15W wireless fast charger..jpg", 4.3, 220);
        seedProduct("Nova Charge Duo 35W", "NOVA", "Dual USB-C wall charger with smart power allocation in a pocketable format. | Specs: Wattage: 35W Dual Port USB-C, Cable Length: N/A, Material: Matte Finish PC, Charging Standard: PD 3.0 / PPS", "1999.00", "Accessories", "/images/products/accessories/multiport charger.jpg", 4.4, 250);
        seedProduct("Nova FlexLink Lightning", "NOVA", "Premium braided USB-C to Apple Lightning cable with MFi certification. | Specs: Wattage: 27W Fast Charging, Cable Length: 1.2 Metres, Material: Braided Nylon, Charging Standard: MFi Apple Lightning", "1299.00", "Accessories", "/images/products/accessories/cable 2.jpg", 4.5, 340);
        seedProduct("Nova Travel Charge Hub", "NOVA", "Universal international travel adapter with built-in multi-port USB charger. | Specs: Wattage: 45W Multi-Port Travel Adapter, Cable Length: N/A, Material: Fire-Retardant ABS, Charging Standard: US/UK/EU Universal Pins", "3499.00", "Accessories", "/images/products/accessories/8in1 docking station.jpg", 4.5, 140);
        seedProduct("Nova DeskMat Ambient", "NOVA", "Felt desk mat with an integrated 10W wireless charging zone for accessories. | Specs: Wattage: 10W Wireless Charging zone, Cable Length: 1.8m Braided Cable, Material: Water-Resistant Felt + Leather, Charging Standard: Qi Wireless", "4499.00", "Accessories", "/images/products/accessories/deskmat ambient.jpg", 4.6, 95);
        seedProduct("Nova PowerVault Mini", "NOVA", "Keychain-sized emergency mini power bank with integrated USB-C connector. | Specs: Wattage: 12W output, Cable Length: Integrated USB-C Connector, Material: ABS Plastic, Charging Standard: Standard 5V/2.4A", "1199.00", "Accessories", "/images/products/accessories/High capacity 20,000mAh laptop power bank with 45W USB-C Power Delivery..jpg", 4, 310);
        seedProduct("Nova MultiLink Hub 5-in-1", "NOVA", "5-in-1 USB-C hub with 4K HDMI, triple USB-A ports, and pass-through power. | Specs: Wattage: 60W Power Delivery, Cable Length: 0.15m Integrated Cable, Material: Aluminium Shell, Charging Standard: USB-C Hub", "2499.00", "Accessories", "/images/products/accessories/8in1 docking station.jpg", 4.4, 150);
        seedProduct("Nova Charge 20W Mini", "NOVA", "Ultra mini fast wall charger designed for phones and accessories. | Specs: Wattage: 20W Fast Charger, Cable Length: N/A, Material: Flame-Resistant PC, Charging Standard: Power Delivery 3.0", "1199.00", "Accessories", "/images/products/accessories/usb-charger.png", 4.2, 420);

    }

    private void seedProduct(String name, String brand, String desc, String price, String cat, String img, double rating, int stock) {
        Optional<Product> existing = productRepository.findAll().stream()
                .filter(p -> p.getName().equals(name))
                .findFirst();

        if (existing.isEmpty()) {
            Product product = new Product();
            product.setName(name);
            product.setDescription(desc);
            product.setPrice(new BigDecimal(price));
            product.setDiscount(BigDecimal.ZERO);
            product.setStock(stock);
            product.setCategory(cat);
            product.setImageUrl(img);
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
