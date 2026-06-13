const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

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

async function main() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'priyansh9977',
        database: 'technest'
    });

    const [products] = await connection.execute('SELECT id, name, category, image_url, description FROM products');
    
    // Categorize existing files accurately
    const availableFiles = {
        'charger': allImages.filter(i => i.startsWith('charger/') && !i.includes('cable') && !i.includes('dock') && !i.includes('mount') && !i.includes('deskmat')),
        'cable': allImages.filter(i => i.startsWith('charger/') && i.includes('cable')),
        'powerbank': allImages.filter(i => i.startsWith('charger/') && (i.includes('powerbank') || i.includes('powervault'))),
        'dock': allImages.filter(i => i.startsWith('charger/') && (i.includes('dock') || i.includes('hub'))),
        'carmount': allImages.filter(i => i.startsWith('charger/') && i.includes('mount')),
        'deskmat': allImages.filter(i => i.startsWith('charger/') && i.includes('deskmat')),
        'smartwatch': allImages.filter(i => i.startsWith('smartwatch/') && !i.includes('ring')),
        'smartring': allImages.filter(i => i.startsWith('smartwatch/') && i.includes('ring')),
        'earbuds': allImages.filter(i => i.startsWith('earbuds/')),
        'headphones': allImages.filter(i => i.startsWith('headphones/') && !i.includes('stand')),
        'speaker': allImages.filter(i => i.startsWith('speaker/')),
        'microphone': allImages.filter(i => i.startsWith('headphones/') && i.includes('hp8')), // Guessing hp8 is mic
        'keyboard': allImages.filter(i => i.startsWith('gaming/') && i.includes('keyboard')),
        'mouse': allImages.filter(i => i.startsWith('gaming/') && i.includes('mouse')),
        'controller': allImages.filter(i => i.startsWith('gaming/') && i.includes('controller')),
        'camera': allImages.filter(i => i.startsWith('smart-device/') && (i.includes('camera') || i.includes('Cam') || i.includes('doorbell'))),
        'smart_home_general': allImages.filter(i => i.startsWith('smart-device/')),
    };

    const analysis = [];
    const missing = [];
    const duplicates = new Map();

    for (const p of products) {
        const lowerName = p.name.toLowerCase();
        let intendedCategory = p.category.toLowerCase();
        let intendedType = 'unknown';

        if (lowerName.includes('headphone') || p.description.toLowerCase().includes('headphone')) intendedType = 'headphones';
        else if (lowerName.includes('earbud') || lowerName.includes('pod') || p.description.toLowerCase().includes('earbud')) intendedType = 'earbuds';
        else if (lowerName.includes('speaker') || lowerName.includes('soundstage')) intendedType = 'speaker';
        else if (lowerName.includes('mic')) intendedType = 'microphone';
        else if (lowerName.includes('watch') || lowerName.includes('band') || lowerName.includes('tracker')) intendedType = 'smartwatch';
        else if (lowerName.includes('ring')) intendedType = 'smartring';
        else if (lowerName.includes('keyboard') || lowerName.includes('keys')) intendedType = 'keyboard';
        else if (lowerName.includes('mouse')) intendedType = 'mouse';
        else if (lowerName.includes('controller') || lowerName.includes('pad') || lowerName.includes('arcade')) intendedType = 'controller';
        else if (lowerName.includes('hub') && !lowerName.includes('home core')) intendedType = 'dock';
        else if (lowerName.includes('cable') || lowerName.includes('link')) intendedType = 'cable';
        else if (lowerName.includes('powerbank') || lowerName.includes('powervault')) intendedType = 'powerbank';
        else if (lowerName.includes('charger') || lowerName.includes('charge')) intendedType = 'charger';
        else if (lowerName.includes('cam') || lowerName.includes('doorbell')) intendedType = 'camera';
        else if (p.category === 'Smart Home') intendedType = 'smart_home_general';
        else intendedType = 'other';

        // Check if the current image matches the intended type
        let isCorrect = false;
        const currentImgPath = p.image_url.replace('/images/products/', '');
        
        if (availableFiles[intendedType] && availableFiles[intendedType].includes(currentImgPath)) {
            isCorrect = true;
        } else if (intendedType === 'smart_home_general' && currentImgPath.startsWith('smart-device/')) {
            isCorrect = true;
        } else if (intendedType === 'charger' && currentImgPath.startsWith('charger/')) {
            // loose check for chargers
             isCorrect = true;
        }

        if (duplicates.has(p.image_url)) {
            duplicates.set(p.image_url, duplicates.get(p.image_url) + 1);
        } else {
            duplicates.set(p.image_url, 1);
        }

        analysis.push({
            id: p.id,
            name: p.name,
            currentImage: p.image_url,
            intendedType,
            isCorrect
        });
    }

    const incorrectMappings = analysis.filter(a => !a.isCorrect);
    const duplicateList = Array.from(duplicates.entries()).filter(([k,v]) => v > 1);

    console.log(`Audited ${products.length} products.`);
    console.log(`Incorrect Mappings: ${incorrectMappings.length}`);
    console.log(`Duplicate Image Assignments: ${duplicateList.length}`);
    
    fs.writeFileSync('audit_results.json', JSON.stringify({incorrectMappings, duplicateList}, null, 2));
    
    await connection.end();
}

main().catch(console.error);
