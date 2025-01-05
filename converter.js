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
            let data = imageData.data;

            // Convert to Uint8Array if necessary
            if (!(data instanceof Uint8Array)) {
                data = new Uint8Array(imageData.data.buffer);
            }

            // Log the type and length of data
            console.log('Type of data:', data.constructor.name);
            console.log('Data length:', data.length);

            // Correctly format the input data for Qoi encoding
            const qoiInput = {
                width: img.width,
                height: img.height,
                channels: 4, // assuming RGBA
                colorspace: 0, // assuming sRGB
                data: data
            };

            console.log("Formatted QOI Input Data:", qoiInput);

            // Qoi encoding using the library
            try {
                // Assuming QOI.encode expects separate arguments
                let qoiData = QOI.encode(qoiInput.width, qoiInput.height, qoiInput.data, qoiInput.channels, qoiInput.colorspace);

                // Base64 encoding
                let base64Data = btoa(String.fromCharCode.apply(null, qoiData));

                // zLib.Deflate compression (using pako library)
                let compressedData = pako.deflate(base64Data);

                // Final Base64 encoding
                let finalBase64Data = btoa(String.fromCharCode.apply(null, compressedData));

                // Display the encoded data
                document.getElementById('output').textContent = finalBase64Data;
            } catch (error) {
                console.error('Qoi encoding error:', error);
                alert('An error occurred during Qoi encoding.');
            }
        };
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        alert('Please select a PNG file.');
    }
}
