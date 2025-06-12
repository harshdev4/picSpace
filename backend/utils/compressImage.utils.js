const sharp = require('sharp');

const compressImage = async (buffer) => {
    const metaData = await sharp(buffer).metadata();

    let sharpInstance = sharp(buffer);

    const MAX_WIDTH = 2000;
    const MAX_HEIGHT = 3000;

    if (metaData.width > MAX_WIDTH || metaData.height > MAX_HEIGHT) {
        let newWidth = metaData.width;
        let newHeight = metaData.height;
        const aspectRatio = newWidth / newHeight;

        if (metaData.width > MAX_WIDTH) {
            newWidth = MAX_WIDTH;
            newHeight = Math.round(newWidth / aspectRatio);
        }

        if (metaData.height > MAX_HEIGHT) {
            newHeight = MAX_HEIGHT;
            newWidth = Math.round(newHeight * aspectRatio);
        }

        sharpInstance = sharpInstance.resize({
            width: newWidth,
            height: newHeight,
            fit: "inside"
        });
    }

    return await sharpInstance.jpeg({ quality: 67 }).toBuffer();
}

module.exports = compressImage;