import { Jimp } from 'jimp';

async function processLogo() {
    try {
        const INPUT_PATH = 'public/images/logo.jpg';
        const OUTPUT_PATH = 'public/images/logo.png';

        console.log(`Reading ${INPUT_PATH}...`);
        const image = await Jimp.read(INPUT_PATH);
        const width = image.bitmap.width;
        const height = image.bitmap.height;

        console.log(`Processing ${width}x${height} image...`);

        // Helper to get pixel index
        const getIdx = (x, y) => (y * width + x) * 4;

        // Check if pixel at (x,y) is "White-ish"
        const isWhite = (x, y) => {
            const idx = getIdx(x, y);
            const r = image.bitmap.data[idx + 0];
            const g = image.bitmap.data[idx + 1];
            const b = image.bitmap.data[idx + 2];
            // Tolerance of 20 (255-20 = 235)
            return r > 235 && g > 235 && b > 235;
        };

        // BFS Flood Fill to remove background
        const queue = [];
        const visited = new Uint8Array(width * height); // 0 = unvisited, 1 = visited

        // Start from corners to be safe (if logo touches edge)
        const corners = [[0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]];

        for (const [startTw, startTh] of corners) {
            if (isWhite(startTw, startTh)) {
                queue.push([startTw, startTh]);
                visited[startTh * width + startTw] = 1;
            }
        }

        let processedPixels = 0;

        while (queue.length > 0) {
            const [x, y] = queue.shift();
            const idx = getIdx(x, y);

            // Make transparent
            image.bitmap.data[idx + 3] = 0;
            processedPixels++;

            // Check neighbors (Up, Down, Left, Right)
            const neighbors = [
                [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
            ];

            for (const [nx, ny] of neighbors) {
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const vIdx = ny * width + nx;
                    if (visited[vIdx] === 0) {
                        if (isWhite(nx, ny)) {
                            visited[vIdx] = 1;
                            queue.push([nx, ny]);
                        }
                    }
                }
            }
        }

        console.log(`Removed background from ${processedPixels} pixels.`);
        console.log(`Saving to ${OUTPUT_PATH}...`);
        await image.write(OUTPUT_PATH);
        console.log('Done!');

    } catch (error) {
        console.error('Error processing logo:', error);
        process.exit(1);
    }
}

processLogo();
