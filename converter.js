function convertPNG() {
    console.log("convertPNG function called");
    const fileInput = document.getElementById('pngFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a PNG file.');
        return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = new Uint8Array(imageData.data.buffer);
        console.log("Image Data Loaded:", data);

        // Encode image data to QOI format
        const qoiInput = {
            width: img.width,
            height: img.height,
            channels: 4,
            colorspace: 0,
            data: data
        };

        console.log("Formatted QOI Input Data:", qoiInput);

        try {
            let qoiData = QOI.encode(qoiInput.data, {
                width: qoiInput.width,
                height: qoiInput.height,
                channels: qoiInput.channels,
                colorspace: qoiInput.colorspace
            });

            if (!qoiData) {
                throw new Error("QOI encoding failed.");
            }

            console.log("QOI Encoded Data Length:", qoiData.length);
            document.getElementById('output').textContent = qoiData;
            // Convert QOI data to Base64
            //let base64Data = arrayBufferToBase64(qoiData);
            //console.log("Base64 Encoded QOI Data:", base64Data);

            // Compress base64 string using zLib Deflate (pako library)
            //let compressedData = pako.deflate(base64Data);
            //console.log("Compressed Data Length:", compressedData.length);

            // Convert compressed data to Base64
            //let finalBase64Data = arrayBufferToBase64(compressedData);
            //console.log("Final Base64 Encoded Data:", finalBase64Data);

            // Display the encoded data
            //document.getElementById('output').textContent = finalBase64Data;
        } catch (error) {
            console.error('Encoding Error:', error);
            alert('An error occurred during encoding.');
        }
    };

    img.onerror = function() {
        alert('An error occurred while loading the image.');
    };
}

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
