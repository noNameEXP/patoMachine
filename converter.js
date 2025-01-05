function convertPNG() {
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

            // Process the image data and convert to the desired format
            let convertedData = "Converted Data:\n";
            for (let i = 0; i < data.length; i += 4) {
                convertedData += `R: ${data[i]}, G: ${data[i+1]}, B: ${data[i+2]}, A: ${data[i+3]}\n`;
            }

            // Display the converted data
            document.getElementById('output').textContent = convertedData;

            // Further encoding steps (Qoi -> base64 -> zLib.Deflate -> base64) would go here
            // You would need libraries for Qoi encoding and zLib compression in JavaScript
        };
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        alert('Please select a PNG file.');
    }
}
