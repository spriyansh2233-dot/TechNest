const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

const inputPath = path.join(__dirname, '../frontend/public/images/products/gaming/gaming-controller.png');
const outputPath = path.join(__dirname, '../frontend/public/images/products/gaming/gaming-controller-transparent.png');

console.log('Reading from:', inputPath);

fs.createReadStream(inputPath)
  .pipe(new PNG())
  .on('parsed', function () {
    const width = this.width;
    const height = this.height;
    console.log(`Image parsed successfully. Dimensions: ${width}x${height}`);

    // Get corner color
    const getPixel = (x, y) => {
      const idx = (width * y + x) << 2;
      return {
        r: this.data[idx],
        g: this.data[idx + 1],
        b: this.data[idx + 2],
        a: this.data[idx + 3]
      };
    };

    const setTransparent = (x, y) => {
      const idx = (width * y + x) << 2;
      this.data[idx + 3] = 0; // Alpha = 0
    };

    const cornerColor = getPixel(0, 0);
    console.log('Corner (0,0) color:', cornerColor);

    // Let's use BFS flood fill to remove the background
    const visited = new Uint8Array(width * height);
    const queue = [];

    // Helper to add pixel to queue
    const enqueue = (x, y) => {
      if (x < 0 || x >= width || y < 0 || y >= height) return;
      const idx = y * width + x;
      if (visited[idx]) return;
      visited[idx] = 1;
      queue.push({ x, y });
    };

    // Add all edge pixels as starting points
    for (let x = 0; x < width; x++) {
      enqueue(x, 0);
      enqueue(x, height - 1);
    }
    for (let y = 0; y < height; y++) {
      enqueue(0, y);
      enqueue(width - 1, y);
    }

    // Color distance threshold
    const threshold = 45; // allows for compression artifacts

    const isSimilar = (c1, c2) => {
      const dr = c1.r - c2.r;
      const dg = c1.g - c2.g;
      const db = c1.b - c2.b;
      return Math.sqrt(dr * dr + dg * dg + db * db) < threshold;
    };

    let count = 0;
    let head = 0;
    while (head < queue.length) {
      const { x, y } = queue[head++];
      const color = getPixel(x, y);

      if (isSimilar(color, cornerColor)) {
        setTransparent(x, y);
        count++;

        // Add neighbors
        enqueue(x + 1, y);
        enqueue(x - 1, y);
        enqueue(x, y + 1);
        enqueue(x, y - 1);
      }
    }

    console.log(`Replaced ${count} pixels out of ${width * height} (${((count / (width * height)) * 100).toFixed(2)}%) with transparency.`);

    this.pack()
      .pipe(fs.createWriteStream(outputPath))
      .on('finish', () => {
        console.log('Saved transparent image to:', outputPath);
      });
  })
  .on('error', (err) => {
    console.error('Error parsing PNG:', err);
  });
