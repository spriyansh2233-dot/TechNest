const fs = require('fs');
const path = require('path');

const SEEDER_PATH = path.join(__dirname, '../backend/src/main/java/com/smartcart/config/DatabaseSeeder.java');
const IMAGES_DIR = path.join(__dirname, '../frontend/public/images/products');

function getImagesInDir(dirPath, prefix = '') {
    const images = [];
    if (!fs.existsSync(dirPath)) return images;
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            images.push(...getImagesInDir(fullPath, `${prefix}${file}/`));
        } else if (file.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
            images.push(`${prefix}${file}`);
        }
    }
    return images;
}

const allImages = getImagesInDir(IMAGES_DIR);

// Categorize images for easier selection
const imagePool = {
    headphone: allImages.filter(img => img.startsWith('headphones/') || img.includes('headphone')),
    earbud: allImages.filter(img => img.startsWith('earbuds/')),
    speaker: allImages.filter(img => img.startsWith('speaker/') || img.includes('soundbar') || img.includes('speaker')),
    smartwatch: allImages.filter(img => img.startsWith('smartwatch/') && !img.includes('ring')),
    ring: allImages.filter(img => img.includes('ring')),
    mouse: allImages.filter(img => img.startsWith('gaming/') && img.includes('mouse')),
    keyboard: allImages.filter(img => img.startsWith('gaming/') && img.includes('keyboard')),
    controller: allImages.filter(img => img.startsWith('gaming/') && (img.includes('controller') || img.includes('gamepad') || img.includes('arcade'))),
    monitor: allImages.filter(img => img.includes('monitor')),
    camera: allImages.filter(img => img.startsWith('smart-device/') && (img.includes('Cam') || img.includes('doorbell') || img.includes('camera'))),
    smart_home: allImages.filter(img => img.startsWith('smart-device/')),
    charger: allImages.filter(img => img.startsWith('charger/') && (img.includes('charger') || img.includes('powerbank') || img.includes('powervault')) && !img.includes('cable') && !img.includes('dock') && !img.includes('car')),
    cable: allImages.filter(img => img.startsWith('charger/') && (img.includes('cable') || img.includes('lightning') || img.includes('micro'))),
    powerbank: allImages.filter(img => img.startsWith('charger/') && (img.includes('powerbank') || img.includes('powervault'))),
    dock: allImages.filter(img => img.startsWith('charger/') && (img.includes('dock') || img.includes('hub'))),
    car_mount: allImages.filter(img => img.startsWith('charger/') && img.includes('car mount')),
    deskmat: allImages.filter(img => img.includes('deskmat')),
    mic: allImages.filter(img => img.includes('mic') || img.includes('stream')),
    general_gaming: allImages.filter(img => img.startsWith('gaming/')),
    general_charger: allImages.filter(img => img.startsWith('charger/'))
};

// State for round-robin / shifting
function popImage(categoryName) {
    if (imagePool[categoryName] && imagePool[categoryName].length > 0) {
        // Shift it from the front
        const img = imagePool[categoryName].shift();
        // Push it back to the end to allow reuse!
        imagePool[categoryName].push(img);
        return `/images/products/${img}`;
    }
    return null;
}

let seederContent = fs.readFileSync(SEEDER_PATH, 'utf-8');

// Regex to find seedProduct calls
const seedProductRegex = /seedProduct\(\s*"([^"]+)",[^,]+,\s*"([^"]+)",\s*"[^"]+",[^,]+,\s*"([^"]+)"/g;

let match;
let productsUpdated = 0;
const report = [];

while ((match = seedProductRegex.exec(seederContent)) !== null) {
    const fullMatch = match[0];
    const name = match[1];
    const desc = match[2];
    const currentImg = match[3];

    let type = 'unknown';
    let newImg = null;

    const lowerName = name.toLowerCase();
    const lowerDesc = desc.toLowerCase();

    // Determine type
    if (lowerName.includes('headphone') || lowerDesc.includes('headphone') || lowerName.includes('anc') && lowerDesc.includes('over-ear') || lowerName.includes('studio')) {
        newImg = popImage('headphone'); type = 'headphones';
    } else if (lowerName.includes('earbud') || lowerName.includes('pod') || lowerDesc.includes('earbud') || lowerName.includes('aerobeat')) {
        newImg = popImage('earbud'); type = 'earbuds';
    } else if (lowerName.includes('speaker') || lowerName.includes('soundstage') || lowerName.includes('ravebox') || lowerName.includes('monitor 5')) {
        newImg = popImage('speaker'); type = 'speaker';
    } else if (lowerName.includes('mic') || lowerName.includes('streamcast')) {
        newImg = popImage('headphone') || popImage('speaker'); type = 'microphone'; // fallback
    } else if (lowerName.includes('watch') || lowerName.includes('band') || lowerName.includes('tracker') || lowerName.includes('fit')) {
        newImg = popImage('smartwatch'); type = 'smartwatch';
    } else if (lowerName.includes('ring')) {
        newImg = popImage('ring'); type = 'smart ring';
    } else if (lowerName.includes('mouse') || lowerDesc.includes('mouse')) {
        newImg = popImage('mouse'); type = 'mouse';
    } else if (lowerName.includes('keyboard') || lowerName.includes('keys')) {
        newImg = popImage('keyboard'); type = 'keyboard';
    } else if (lowerName.includes('controller') || lowerName.includes('pad') || lowerName.includes('arcade')) {
        newImg = popImage('controller'); type = 'controller';
    } else if (lowerName.includes('monitor') || lowerName.includes('spectravision')) {
        newImg = popImage('monitor') || popImage('general_gaming'); type = 'monitor';
    } else if (lowerName.includes('hub') && !lowerName.includes('home core')) {
        newImg = popImage('dock'); type = 'dock/hub';
    } else if (lowerName.includes('dock')) {
        newImg = popImage('dock'); type = 'dock';
    } else if (lowerName.includes('cable') || lowerName.includes('link')) {
        newImg = popImage('cable'); type = 'cable';
    } else if (lowerName.includes('powerbank') || lowerName.includes('powervault')) {
        newImg = popImage('powerbank'); type = 'power bank';
    } else if (lowerName.includes('charger') || lowerName.includes('charge') || lowerName.includes('stand')) {
        newImg = popImage('charger'); type = 'charger';
    } else if (lowerName.includes('mount')) {
        newImg = popImage('car_mount'); type = 'car mount';
    } else if (lowerName.includes('deskmat')) {
        newImg = popImage('deskmat'); type = 'deskmat';
    } else if (lowerName.includes('cam') || lowerName.includes('doorbell')) {
        newImg = popImage('camera'); type = 'camera';
    } else {
        // Smart device fallback
        newImg = popImage('smart_home'); type = 'smart device';
    }

    // fallback
    if (!newImg) {
        if (lowerName.includes('nova')) {
             if (lowerDesc.includes('audio') || lowerDesc.includes('speaker') || lowerDesc.includes('sound')) newImg = popImage('earbud') || popImage('headphone');
             else if (lowerDesc.includes('watch') || lowerDesc.includes('band')) newImg = popImage('smartwatch');
             else if (lowerDesc.includes('gaming') || lowerDesc.includes('mouse') || lowerDesc.includes('keyboard')) newImg = popImage('general_gaming');
             else if (lowerDesc.includes('smart') || lowerDesc.includes('sensor') || lowerDesc.includes('cam')) newImg = popImage('smart_home');
             else newImg = popImage('general_charger');
        }
    }

    if (newImg) {
        const replaceString = fullMatch.replace(currentImg, newImg);
        seederContent = seederContent.replace(fullMatch, replaceString);
        productsUpdated++;
        report.push(`- **${name}** (${type}) -> \`${newImg}\``);
    } else {
        report.push(`- **${name}** (${type}) -> ❌ NO IMAGE FOUND`);
    }
}

fs.writeFileSync(SEEDER_PATH, seederContent, 'utf-8');

const reportContent = `
# Product Image Mapping Report

**Products Updated:** ${productsUpdated}

## Mappings
${report.join('\n')}
`;

fs.writeFileSync(path.join(__dirname, '../image_mapping_report.md'), reportContent, 'utf-8');

console.log("Mapping complete. Products updated:", productsUpdated);
