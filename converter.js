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

            // Convert QOI data to Base64
            let base64Data = arrayBufferToBase64(qoiData);
            console.log("Base64 Encoded QOI Data:", base64Data);

            // Send the encoded data to the Vercel website
            fetch('https://pato-machine.vercel.app//api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image: base64Data })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                document.getElementById('output').textContent = 'Image uploaded successfully!';
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred during the upload.');
            });
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
