function convertPNG() {
    console.log("convertPNG function called"); // Verify function execution
    const fileInput = document.getElementById('pngFile');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = new Uint8Array(imageData.data.buffer);

            const qoiInput = {
                width: img.width,
                height: img.height,
                channels: 4, // assuming RGBA
                colorspace: 0, // assuming sRGB
                data: data
            };

            console.log("Formatted QOI Input Data:", qoiInput);

            try {
                // Use the locally included QOI encode function
                let qoiData = QOI.encode(qoiInput.data, {
                    width: qoiInput.width,
                    height: qoiInput.height,
                    channels: qoiInput.channels,
                    colorspace: qoiInput.colorspace
                });
                console.log("QOI Data Length: ", qoiData.length);

                // Base64 encoding
                let base64Data = arrayBufferToBase64(new Uint8Array(qoiData).buffer);
                console.log("First Base64 Data Length: ", base64Data.length);

                // zLib.Deflate compression (using pako library)
                let compressedData = pako.deflate(base64Data);
                console.log("Compressed Data Length: ", compressedData.length);

                // Final Base64 encoding
                let finalBase64Data = arrayBufferToBase64(compressedData);
                console.log("Final Base64 Data Length: ", finalBase64Data.length);

                // Display the encoded data
                document.getElementById('output').textContent = finalBase64Data;
            } catch (error) {
                console.error('Encoding error:', error);
                alert('An error occurred during encoding.');
            }
        };
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        alert('Please select a PNG file.');
    }
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
