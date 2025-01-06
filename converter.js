const fetch = require('node-fetch'); // Import node-fetch

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL is required' });
    }

    try {
        // Fetch the image from the provided URL
        const response = await fetch(imageUrl);
        const buffer = await response.buffer();

        // Create a canvas and draw the image
        const { createCanvas, loadImage } = require('canvas');
        const canvas = createCanvas();
        const ctx = canvas.getContext('2d');
        const img = await loadImage(buffer);
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = new Uint8Array(imageData.data.buffer);

        // Encode image data to QOI format
        const qoiInput = {
            width: img.width,
            height: img.height,
            channels: 4,
            colorspace: 0,
            data: data
        };

        let qoiData = QOI.encode(qoiInput.data, {
            width: qoiInput.width,
            height: qoiInput.height,
            channels: qoiInput.channels,
            colorspace: qoiInput.colorspace
        });

        if (!qoiData) {
            throw new Error("QOI encoding failed.");
        }

        // Convert QOI data to Base64
        let base64Data = arrayBufferToBase64(qoiData);

        res.status(200).json({ base64Data });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred while processing the image.' });
    }
};

// Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
