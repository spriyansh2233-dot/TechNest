const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const audioImages = {
    headphones: [
        "audio gear/hp 1.jpg", "audio gear/hp2.jpg", "audio gear/hp3.jpg", 
        "audio gear/hp4.jpg", "audio gear/hp6.jpg", "audio gear/hp7.jpg"
    ],
    earbuds: [
        "audio gear/earbuds.jpg", "audio gear/earbuds 1.jpg", "audio gear/earbuds 2.jpg",
        "audio gear/earbuds 3.jpg", "audio gear/earbuds 4.jpg", "audio gear/earbuds 5.jpg",
        "audio gear/earbuds 6.jpg", "earbuds.png"
    ],
    speaker: [
        "audio gear/speaker.jpg", "audio gear/speaker1.jpg", "audio gear/speaker2.jpg",
        "audio gear/speaker3.jpg", "audio gear/speaker4.jpg", "audio gear/speaker5.jpg"
    ],
    mic: [
        "audio gear/hp5.jpg", "audio gear/hp8.jpg"
    ]
};

const wearableImages = {
    watch: [
        "wearables/smartwatch.png", "wearables/sw.jpg", "wearables/sw 1.jpg", "wearables/sw2.jpg",
        "wearables/sw3.jpg", "wearables/sw4.jpg", "wearables/sw5.jpg", "wearables/sw6.jpg",
        "wearables/sw7.jpg", "wearables/sw8.jpg", "wearables/sw9.jpg"
    ],
    ring: [
        "wearables/smart ring.jpg", "wearables/tech ring.jpg"
    ]
};

const pool = {
    headphones: [...audioImages.headphones],
    earbuds: [...audioImages.earbuds],
    speaker: [...audioImages.speaker],
    mic: [...audioImages.mic],
    watch: [...wearableImages.watch],
    ring: [...wearableImages.ring]
};

function popImage(type) {
    if (!pool[type] || pool[type].length === 0) {
        if (audioImages[type]) pool[type] = [...audioImages[type]];
        else if (wearableImages[type]) pool[type] = [...wearableImages[type]];
    }
    return '/images/products/' + pool[type].shift();
}

async function main() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'priyansh9977',
        database: 'technest'
    });

    // 1. Fetch Audio
    const [audio] = await connection.execute('SELECT * FROM products WHERE category = "Audio"');
    for (const p of audio) {
        let type = 'earbuds'; // default audio
        const n = p.name.toLowerCase();
        if (n.includes('wave') || n.includes('studio') || n.includes('headphone') || n.includes('anc')) type = 'headphones';
        if (n.includes('speaker') || n.includes('soundstage') || n.includes('rave') || n.includes('monitor')) type = 'speaker';
        if (n.includes('mic')) type = 'mic';
        if (n.includes('pod') || n.includes('bud')) type = 'earbuds';
        
        const newImg = popImage(type);
        await connection.execute('UPDATE products SET image_url = ? WHERE id = ?', [newImg, p.id]);
        console.log("Updated Audio:", p.name, "->", newImg);
    }

    // 2. Fetch Wearables
    const [wearables] = await connection.execute('SELECT * FROM products WHERE category = "Wearables"');
    for (const p of wearables) {
        let type = 'watch';
        const n = p.name.toLowerCase();
        if (n.includes('ring')) type = 'ring';
        
        const newImg = popImage(type);
        await connection.execute('UPDATE products SET image_url = ? WHERE id = ?', [newImg, p.id]);
        console.log("Updated Wearable:", p.name, "->", newImg);
    }

    // Update the generated seeder
    const [all] = await connection.execute('SELECT * FROM products');
    let javaSeederContent = '';
    for (const p of all) {
        const safeName = p.name.replace(/"/g, '\\"');
        const safeDesc = p.description ? p.description.replace(/"/g, '\\"') : '';
        const safeBrand = p.brand ? p.brand : 'NOVA';
        const safeImg = p.image_url;

        javaSeederContent += '        seedProduct("' + safeName + '", "' + safeBrand + '", "' + safeDesc + '", "' + p.price + '", "' + p.category + '", "' + safeImg + '", ' + p.rating + ', ' + p.stock + ');\n';
    }
    fs.writeFileSync(path.join(__dirname, '../generated_seedProducts.txt'), javaSeederContent, 'utf-8');

    await connection.end();
}

main().catch(console.error);
