import { Jimp } from 'jimp';

async function processLogo() {
    try {
        const INPUT_PATH = 'public/images/logo.jpg';
        const OUTPUT_PATH = 'public/images/logo.png';

        console.log(`Reading ${INPUT_PATH}...`);
        const image = await Jimp.read(INPUT_PATH);

        console.log('Processing image: Converting white to transparent...');

        // Scan all pixels
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];

            // Threshold for "White". 
            if (red > 230 && green > 230 && blue > 230) {
                this.bitmap.data[idx + 3] = 0; // Set Alpha to 0
            }
        });

        console.log(`Saving to ${OUTPUT_PATH}...`);
        await image.write(OUTPUT_PATH);
        console.log('Done!');
    } catch (error) {
        console.error('Error processing logo:', error);
        process.exit(1);
    }
}

processLogo();
