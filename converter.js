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
            const data = imageData.data;

            // Qoi encoding using the library
            let qoiData = QOI.encode({ width: img.width, height: img.height, data: data });

            // Base64 encoding
            let base64Data = btoa(String.fromCharCode.apply(null, qoiData));

            // zLib.Deflate compression (using pako library)
            let compressedData = pako.deflate(base64Data);

            // Final Base64 encoding
            let finalBase64Data = btoa(String.fromCharCode.apply(null, compressedData));

            // Display the encoded data
            document.getElementById('output').textContent = finalBase64Data;
        };
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        alert('Please select a PNG file.');
    }
}
