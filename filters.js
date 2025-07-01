//=================================================================================================================

/* Filters */

//=================================================================================================================

function greyscaleFilter (img)
{
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();
    
    for (var x=0; x<imgOut.width; x++){
        for (var y=0; y<imgOut.height; y++){
            // Calculate the index for the current pixel
            var index = (y*img.width + x) * 4;
            
            // Get the RGB values of the current pixel
            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];
            
            // Convert to greyscale using the average method
            var grey = (r + g + b) / 3; 
            
            // Increase brightness by 20%
            grey = grey * 1.2;

            // Ensure the value stays within the valid range (0-255)
            grey = constrain(grey, 0, 255);

            // Set the greyscale value to the output image
            imgOut.pixels[index + 0] = grey;
            imgOut.pixels[index + 1] = grey;
            imgOut.pixels[index + 2] = grey;
            imgOut.pixels[index + 3] = 255; // Alpha channel (fully opaque)
        }
    }
    imgOut.updatePixels();
    return imgOut;
}

//=================================================================================================================

function rgbFilter(img, r, g, b)
{
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();
    
    for (var x=0; x<img.width; x++){
        for (var y=0; y<img.height; y++){
            
            var index = (y*img.width + x) * 4;
            
            var redValue = img.pixels[index + 0];
            var greenValue = img.pixels[index + 1];
            var blueValue = img.pixels[index + 2];
            
            // constrain the values to the valid range [0, 255]
            imgOut.pixels[index + 0] = constrain(redValue * r, 0, 255);
            imgOut.pixels[index + 1] = constrain(greenValue * g, 0, 255);
            imgOut.pixels[index + 2] = constrain(blueValue * b, 0, 255);
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}

//=================================================================================================================

function rgb_thresholdFilter(img, channel, slider) {
    var imgOut = createImage(img.width, img.height);

    imgOut.loadPixels();
    img.loadPixels();

    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {

            var index = (y * img.width + x) * 4;

            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];

            // Apply threshold to the specified channel
            if (channel === 'red' && r > slider.value()) {
                r = 255;
            } else if (channel === 'red') {
                r = 0;
            }

            if (channel === 'green' && g > slider.value()) {
                g = 255;
            } else if (channel === 'green') {
                g = 0;
            }

            if (channel === 'blue' && b > slider.value()) {
                b = 255;
            } else if (channel === 'blue') {
                b = 0;
            }

            imgOut.pixels[index + 0] = r;
            imgOut.pixels[index + 1] = g;
            imgOut.pixels[index + 2] = b;
            imgOut.pixels[index + 3] = 255; 
        }
    }

    imgOut.updatePixels();
    return imgOut;
}

//=================================================================================================================

function hsv_thresholdFilter(img)
{
    var imgOut = createImage(img.width, img.height);

    imgOut.loadPixels();
    img.loadPixels();

    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {

            var index = (y * img.width + x) * 4;

            var h = img.pixels[index + 0] / 255 * 360;          // [0, 360]
            var s = img.pixels[index + 1] / 255;    // [0, 1]
            var v = img.pixels[index + 2] / 255;    // [0, 1]

             // Apply threshold to the Hue value
             if (h > hsv_thresholdSlider.value() / 255 * 360) {
                // Keep the pixel as is (meets the threshold condition)
                imgOut.pixels[index + 0] = h * 255 / 360;   // Hue (0-360)
                imgOut.pixels[index + 1] = s * 255;         // Saturation (0-255)
                imgOut.pixels[index + 2] = v * 255;         // Value (0-255)
            } else {
                // Set the pixel to black (does not meet the threshold condition)
                imgOut.pixels[index + 0] = 0;       
                imgOut.pixels[index + 1] = 0;      
                imgOut.pixels[index + 2] = 0;      
            }

            // Alpha channel (fully opaque)
            imgOut.pixels[index + 3] = 255;
        }
    }

    imgOut.updatePixels();
    return imgOut;
}

//=================================================================================================================

function cmyk_thresholdFilter(img)
{
    var imgOut = createImage(img.width, img.height);

    imgOut.loadPixels();
    img.loadPixels();

    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {

            var index = (y * img.width + x) * 4;

            var cyan = img.pixels[index + 0] / 255;     // [0, 1]
            var magenta = img.pixels[index + 1] / 255;  // [0, 1]
            var yellow = img.pixels[index + 2] / 255;   // [0, 1]
            var black = img.pixels[index + 3] / 255;    // [0, 1]

             // Apply threshold to black channel
            if (black > cmyk_thresholdSlider.value() / 255)
            {
                // Keep the pixel as is
                imgOut.pixels[index + 0] = cyan * 255;
                imgOut.pixels[index + 1] = magenta * 255;
                imgOut.pixels[index + 2] = yellow * 255;
                imgOut.pixels[index + 3] = black * 255;
            }
            else
            {
                // Set the pixel to white 
                imgOut.pixels[index + 0] = 255;
                imgOut.pixels[index + 1] = 255;
                imgOut.pixels[index + 2] = 255;
                imgOut.pixels[index + 3] = 255;
            }
        }
    }

    imgOut.updatePixels();
    return imgOut;
}

//=================================================================================================================

var kernelSize = 25; // Increase blur effect
var matrix = Array.from({ length: kernelSize }, () => 
    Array(kernelSize).fill(1 / (kernelSize * kernelSize))
);

function convolution(x, y, matrix, matrixSize, img) 
{
    var totalRed = 0;
    var totalGreen = 0;
    var totalBlue = 0;
    
    var offset = floor(matrixSize / 2);
    
    for (var i=0; i<matrixSize; i++){
        for (var j=0; j<matrixSize; j++){
            // Clamp coordinates to image boundaries
            var xLoc = constrain(x + i - offset, 0, img.width - 1);
            var yLoc = constrain(y + j - offset, 0, img.height - 1);
            
            var index = (img.width * yLoc + xLoc) * 4;
            
            index = constrain(index, 0, img.pixels.length - 1);
            
            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }
    // Clamp values to 0-255
    return [
        constrain(totalRed, 0, 255),
        constrain(totalGreen, 0, 255),
        constrain(totalBlue, 0, 255)
    ];
}

function blurFilter(img) 
{
    var imgOut = createImage(img.width, img.height);
    var matrixSize = matrix.length;
        
    imgOut.loadPixels();
    img.loadPixels();
    
    for (var x=0; x<imgOut.width; x++){
        for (var y=0; y<imgOut.height; y++){
            
            var index = (y*imgOut.width + x) * 4;
        
            var c = convolution(x, y, matrix, matrixSize, img);
            
            imgOut.pixels[index + 0] = c[0];
            imgOut.pixels[index + 1] = c[1];
            imgOut.pixels[index + 2] = c[2];
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}

//=================================================================================================================

function pixelateFilter(img) 
{
    // Convert the image to greyscale first
    var imgOut = greyscaleFilter(img);
    var blockSize = 5; // 5x5 pixel blocks
    
    imgOut.loadPixels();
    
    for (var x = 0; x < imgOut.width; x += blockSize) {
        for (var y = 0; y < imgOut.height; y += blockSize) {
            var sum = 0;
            var count = 0;
            
            // Loop through each pixel in the block
            for (var bx = 0; bx < blockSize; bx++) {
                for (var by = 0; by < blockSize; by++) {
                    var px = x + bx;
                    var py = y + by;
                    
                    if (px < imgOut.width && py < imgOut.height) {
                        var index = (py * imgOut.width + px) * 4;
                        sum += imgOut.pixels[index]; // Only need one channel (greyscale)
                        count++;
                    }
                }
            }

            var avePixInt = sum / count; // Calculate average pixel intensity
            avePixInt = Math.floor(avePixInt / 50) * 50; // Round to nearest 50 for more blocky effect

            // Paint the entire block with the average intensity
            for (var bx = 0; bx < blockSize; bx++) {
                for (var by = 0; by < blockSize; by++) {
                    var px = x + bx;
                    var py = y + by;
                    
                    if (px < imgOut.width && py < imgOut.height) {
                        var index = (py * imgOut.width + px) * 4;
                        imgOut.pixels[index] = avePixInt;
                        imgOut.pixels[index + 1] = avePixInt;
                        imgOut.pixels[index + 2] = avePixInt;
                        imgOut.pixels[index + 3] = 255; // Fully opaque
                    }
                }
            }
        }
    }

    imgOut.updatePixels();
    return imgOut;
}

//=================================================================================================================

function drawFaces(option) 
{
    const filters = {
        1: greyscaleFilter,
        2: blurFilter,
        3: rgb_to_hsv,
        4: pixelateFilter
    };

    for (let face of faces) {
        if (face[4] > 4) { // Confidence threshold

            // Extract the detected face region
            var detectedFace = snapshot.get(face[0], face[1], face[2], face[3]);
            
            image(detectedFace, width*3/4, 2*space, 50, 50);  // WORKED WELL, CAN BE DRAWN
            textAlign(LEFT);
            text("Face detected:", width*3/4, 2*space);

            const filter = filters[option];
            if (!filter) continue;

            // const filteredFace = filter(detectedFace); // BUT FAILED HERE
            const filteredFace = filter(faceReplacement);
            image(filteredFace, face[0] + col1, face[1] + row5, face[2], face[3]);
        }
    }
}

//=================================================================================================================

/* Extension filters */

//=================================================================================================================

function invertAndColorShiftFilter(img) 
{
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();
    
    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {

            var index = (y * img.width + x) * 4;

            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];

            // Invert colors
            r = 255 - r;
            g = 255 - g;
            b = 255 - b;

            // Apply random color shift
            r = constrain(r + random(-50, 50), 0, 255);
            g = constrain(g + random(-50, 50), 0, 255);
            b = constrain(b + random(-50, 50), 0, 255);

            imgOut.pixels[index + 0] = r;
            imgOut.pixels[index + 1] = g;
            imgOut.pixels[index + 2] = b;
            imgOut.pixels[index + 3] = 255; // Alpha channel (fully opaque)
        }
    }

    imgOut.updatePixels();
    return imgOut;
}

function symmetryFilter(img) 
{
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    let midX = img.width / 2;
    
    // Loop through the left half of the image
    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < midX; x++) {
            let col = img.get(x, y);  // Get pixel color at (x, y)
            imgOut.set(x, y, col); // Copy pixel to the left side of the output image
            imgOut.set(img.width - x - 1, y, col); // Reflect pixel to the right side
        }
    }

    imgOut.updatePixels();
    return imgOut;
}

function waveDistortionFilter(img, amplitude = 5, frequency = 0.5) 
{
    let imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            let waveOffset = Math.sin(y * frequency) * amplitude;
            let newX = constrain(x + waveOffset, 0, img.width - 1);
            let col = img.get(newX, y);
            imgOut.set(x, y, col);
        }
    }

    imgOut.updatePixels();
    return imgOut;
}

function processSnapshot() {
    greyscale_img = greyscaleFilter(snapshot);
    red_img = rgbFilter(snapshot, 1, 0.5, 0.5);
    green_img = rgbFilter(snapshot, 0.5, 1, 0.5);
    blue_img = rgbFilter(snapshot, 0.5, 0.5, 1);

    red_threshold_img = rgb_thresholdFilter(snapshot, 'red', red_thresholdSlider);
    green_threshold_img = rgb_thresholdFilter(snapshot, 'green', green_thresholdSlider);
    blue_threshold_img = rgb_thresholdFilter(snapshot, 'blue', blue_thresholdSlider);

    hsv_img = rgb_to_hsv(snapshot);
    hsv_thereshold_img = hsv_thresholdFilter(hsv_img);

    cmyk_img = rgb_to_cmyk(snapshot);
    cmyk_threshold_img = cmyk_thresholdFilter(cmyk_img);

    inv_colorshift_img = invertAndColorShiftFilter(snapshot);
    symmetry_img = symmetryFilter(snapshot);
    wave_distortion_img = waveDistortionFilter(snapshot);
}