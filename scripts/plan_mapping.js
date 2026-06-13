const fs = require('fs');
const mysql = require('mysql2/promise');

const productsToType = {
    "Nova Wave ANC": "headphones",
    "Nova SyncPods": "earbuds",
    "Nova Soundstage Mini": "speaker",
    "Nova Wave Studio": "headphones",
    "Nova Orbit Max": "headphones",
    "Nova AeroBeat": "earbuds",
    "Nova SyncPods Elite": "earbuds",
    "Nova Soundstage Pro": "speaker",
    "Nova StreamCast Mic": "microphone",
    "Nova EchoSphere Speaker": "speaker",
    "Nova RaveBox": "speaker",
    "Nova Monitor 5": "speaker",
    "Nova PurePods": "earbuds",
    "Nova AirFlow": "headphones",
    "Nova Clarity Bud": "earbuds",
    "Nova Symphony One": "headphones",
    "Nova BeatBuds": "earbuds",
    "Nova Horizon Watch": "smartwatch",
    "Nova Apex Fit": "smartwatch",
    "Nova Zenith Watch": "smartwatch",
    "Nova Aura Ring": "smartring",
    "Nova FitBand Lite": "smartwatch",
    "Nova Aero Tracker": "smartwatch",
    "Nova Luxe Smartwatch": "smartwatch",
    "Nova Ring Pro": "smartring",
    "Nova Zenith Fit": "smartwatch",
    "Nova Chronos X": "smarthub",
    "Nova Motion Pro": "motionsensor",
    "Nova Elevate Ultra": "motionsensor",
    "Nova Active Pulse": "smartplug",
    "Nova Chronos Classic": "thermostat",
    "Nova Horizon Lite": "smokedetector",
    "Nova Strike Mechanical": "camera",
    "Nova Home Core Hub": "smarthub",
    "Nova Lumina Lightstrip": "lightstrip",
    "Nova Guardian Cam": "camera",
    "Nova Sense Mini Sensor": "tempsensor",
    "Nova Smart Plug Pro": "smartplug",
    "Nova Guardian Cam Outdoor": "camera",
    "Nova Lumina Smart Bulb": "smartbulb",
    "Nova Sense Temp Sensor": "tempsensor",
    "Nova Smart Thermostat": "thermostat",
    "Nova Smart Lock Pro": "smartlock",
    "Nova Guardian Video Doorbell": "doorbell",
    "Nova Lumina Ceiling Panel": "ceilingpanel",
    "Nova Flow Water Valve": "watervalve",
    "Nova Aura Humidifier": "humidifier",
    "Nova Guard Smoke Detector": "smokedetector",
    "Nova Phantom Controller": "controller",
    "Nova Titan RGB Keyboard": "keyboard",
    "Nova Vortex Mouse": "mouse",
    "Nova Strike Elite Mouse": "mouse",
    "Nova Velocity Pro Keyboard": "keyboard",
    "Nova Arena Hub Controller": "controller",
    "Nova CyberKeys K75": "keyboard",
    "Nova HyperGlide Mouse": "mouse",
    "Nova ErgoSplit Keyboard": "keyboard",
    "Nova Apex Control Pad": "controller",
    "Nova Aegis Gaming Headset": "headset",
    "Nova SpectraVision 27": "monitor",
    "Nova Phantom Mouse": "mouse",
    "Nova Gladiator Arcade": "controller",
    "Nova Charge 65": "charger",
    "Nova FlexLink Cable": "cable",
    "Nova PowerVault 10K": "powerbank",
    "Nova Dock Pro": "dock",
    "Nova AirStand Qi": "wirelessstand",
    "Nova PowerVault 20K": "powerbank",
    "Nova Charge 100 GaN": "charger",
    "Nova BaseStation Stand": "wirelessstand",
    "Nova FlexLink Micro": "cable",
    "Nova MagMount Car": "carmount",
    "Nova Charge Duo 35W": "charger",
    "Nova FlexLink Lightning": "cable",
    "Nova Travel Charge Hub": "dock",
    "Nova DeskMat Ambient": "deskmat",
    "Nova PowerVault Mini": "powerbank",
    "Nova MultiLink Hub 5-in-1": "dock",
    "Nova Charge 20W Mini": "charger"
};

const typeToImages = {
    "headphones": [
        "audio gear/hp 1.jpg", "audio gear/hp2.jpg", "audio gear/hp3.jpg", 
        "audio gear/hp4.jpg", "audio gear/hp6.jpg", "audio gear/hp7.jpg"
    ],
    "earbuds": [
        "audio gear/earbuds.jpg", "audio gear/earbuds 1.jpg", "audio gear/earbuds 2.jpg",
        "audio gear/earbuds 3.jpg", "audio gear/earbuds 4.jpg", "audio gear/earbuds 5.jpg",
        "audio gear/earbuds 6.jpg", "earbuds.png"
    ],
    "speaker": [
        "audio gear/speaker.jpg", "audio gear/speaker1.jpg", "audio gear/speaker2.jpg",
        "audio gear/speaker3.jpg", "audio gear/speaker4.jpg", "audio gear/speaker5.jpg"
    ],
    "microphone": [
        "audio gear/hp5.jpg", "audio gear/hp8.jpg"
    ],
    "smartwatch": [
        "wearables/smartwatch.png", "wearables/sw.jpg", "wearables/sw 1.jpg", "wearables/sw2.jpg",
        "wearables/sw3.jpg", "wearables/sw4.jpg", "wearables/sw5.jpg", "wearables/sw6.jpg",
        "wearables/sw7.jpg", "wearables/sw8.jpg", "wearables/sw9.jpg"
    ],
    "smartring": [
        "wearables/smart ring.jpg", "wearables/tech ring.jpg"
    ],
    "smarthub": [
        "smart-device/Central smart home hub connecting all Zigbee and Thread smart devices locally. 2.jpg",
        "smart-device/Central smart home hub connecting all Zigbee and Thread smart devices locally..jpg"
    ],
    "motionsensor": [
        "smart-device/Compact motion sensor detecting movement up to 7 metres with 170-degree range..jpg"
    ],
    "smartplug": [
        "smart-device/Compact smart plug with power consumption monitoring and scheduled timers..jpg"
    ],
    "thermostat": [
        "smart-device/Intelligent thermostat featuring automatic schedule learning and geofencing..jpg"
    ],
    "smokedetector": [
        "smart-device/Interlinked smart smoke and carbon monoxide detector sending real-time alerts..jpg",
        "smart-device/smoke detecotr.jpg"
    ],
    "camera": [
        "smart-device/Nova Guardian Cam.jpg",
        "smart-device/Weather-proof wireless outdoor camera with rechargeable battery and solar panel support..jpg"
    ],
    "lightstrip": [
        "smart-device/Smart flexible lightstrip offering 16 million colours with dynamic audio sync..jpg"
    ],
    "tempsensor": [
        "smart-device/Precision temperature and humidity sensor triggering automatic HVAC rules..jpg"
    ],
    "smartbulb": [
        "lumina-sync.jpg"
    ],
    "smartlock": [
        "smart-device/Retrofit smart lock supporting keyless entry, codes, and fingerprint access..jpg"
    ],
    "doorbell": [
        "smart-device/Smart doorbell featuring two-way audio, custom quick replies, and human detection..jpg"
    ],
    "ceilingpanel": [
        "smart-device/Modern flush-mount ambient smart ceiling panel with adjustable white tones..jpg"
    ],
    "watervalve": [
        "smart-device/Smart water main shutoff valve controller with automated leak detection routines..jpg"
    ],
    "humidifier": [
        "smart-device/Smart ultrasonic humidifier with adjustable mist settings and essential oil tray..jpg"
    ],
    "controller": [
        "gaming/controller.jpg", "gaming/controller1.jpg", "gaming/controller2.jpg", "gaming/gaming-controller.png"
    ],
    "keyboard": [
        "gaming/keyboard.jpg", "gaming/keyboard1.jpg", "gaming/keyboard2.jpg", "gaming/keyboard3.jpg",
        "gaming/keyboard4.jpg", "gaming/keyboard5.jpg", "gaming/mechanical-keyboard.png", "gaming/split-keyboard.png",
        "gaming/wired keyboard.jpg"
    ],
    "mouse": [
        "gaming/mouse.jpg", "gaming/mouse1.jpg", "gaming/mouse2.jpg", "gaming/mouse3.jpg",
        "gaming/mouse4.jpg", "gaming/mouse5.jpg", "gaming/mouse6.jpg", "gaming/gaming-mouse.png"
    ],
    "headset": [
        "gaming/gaming headset.jpg"
    ],
    "monitor": [
        "monitor.png"
    ],
    "charger": [
        "accessories/charger.jpg", "accessories/charger1.jpg", "accessories/charger2.jpg",
        "accessories/charger3.jpg", "accessories/charger4.jpg", "accessories/charger5.jpg",
        "accessories/multiport charger.jpg", "accessories/usb-charger.png"
    ],
    "cable": [
        "accessories/cable.jpg", "accessories/cable1.jpg", "accessories/cable 2.jpg",
        "accessories/cable 3.jpg", "accessories/cable 4 (multi).jpg", "accessories/cable 5.jpg",
        "accessories/lightning charger cable.jpg"
    ],
    "powerbank": [
        "accessories/powerbank.png", "accessories/powervault.jpg", "accessories/High capacity 20,000mAh laptop power bank with 45W USB-C Power Delivery..jpg"
    ],
    "dock": [
        "accessories/8in1 docking station.jpg"
    ],
    "wirelessstand": [
        "accessories/5in 1 charger.jpg", "accessories/3-in-1 premium charging stand for phone, smartwatch, and wireless earbuds.'.jpg"
    ],
    "carmount": [
        "accessories/Magnetic air-vent car mount with integrated 15W wireless fast charger..jpg"
    ],
    "deskmat": [
        "accessories/deskmat ambient.jpg"
    ]
};

async function main() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'priyansh9977',
        database: 'technest'
    });

    const [products] = await connection.execute('SELECT id, name, description, image_url FROM products');
    
    // Create copy for rotation
    const pool = {};
    for (const [k, v] of Object.entries(typeToImages)) {
        pool[k] = [...v];
    }
    
    function popImage(type) {
        if (!pool[type] || pool[type].length === 0) {
            // Refill
            pool[type] = [...(typeToImages[type] || [])];
        }
        if (!pool[type] || pool[type].length === 0) return null;
        const img = pool[type].shift();
        return '/images/products/' + img;
    }

    const newMappings = [];
    
    for (const p of products) {
        let type = productsToType[p.name];
        if (!type) {
            // fallback generic
            type = 'charger'; 
        }
        
        let newImg = popImage(type);
        if (!newImg) newImg = p.image_url; // safety
        
        newMappings.push({ id: p.id, name: p.name, oldImage: p.image_url, newImage: newImg, type: type });
    }
    
    console.log(JSON.stringify(newMappings, null, 2));
    
    await connection.end();
}

main().catch(console.error);
