//=================================================================================================================

/* This file contains functions of colour space conversions, RGB to HSV & CMYK. */

//=================================================================================================================

/** RGB-HSV conversion (Hue Saturation Value) */
function rgb_to_hsv(img) {
    var imgOut = createImage(img.width, img.height);

    imgOut.loadPixels();
    img.loadPixels();

    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {
            var index = (y * img.width + x) * 4;

            // Get RGB values and normalize to [0, 1]
            var R = img.pixels[index + 0] / 255;
            var G = img.pixels[index + 1] / 255;
            var B = img.pixels[index + 2] / 255;

            // Maximum and Minimum values from RGB triplet
            var max_rgb = max(R, G, B);
            var min_rgb = min(R, G, B);
            var delta = max_rgb - min_rgb;

            /** Value, V (brightness: 0-100%) */
            var V = max_rgb;

            /** Saturation, S (colour intensity: 0-100%) */
            var S = (max_rgb === 0) ? 0 : delta / max_rgb;

            /** Hue, H (colour type: 0-360 degrees) */
            var H = 0;
            if (delta !== 0) {
                if (max_rgb === R) {
                    H = ((G - B) / delta) % 6;
                } else if (max_rgb === G) {
                    H = (B - R) / delta + 2;
                } else if (max_rgb === B) {
                    H = (R - G) / delta + 4;
                }
                H = (H < 0) ? H + 6 : H; // Ensure H is positive
            }

            // Convert H to degrees [0, 360]
            H *= 60;

            // Ensure valid ranges
            H = constrain(H, 0, 360); // 0-360 degrees
            S = constrain(S, 0, 1); // 0-100%
            V = constrain(V, 0, 1); // 0-100%

            // Store HSV values in the output image
            imgOut.pixels[index + 0] = H * 255 / 360;   // Hue (0-360)
            imgOut.pixels[index + 1] = S * 255;         // Saturation (0-255)
            imgOut.pixels[index + 2] = V * 255;         // Value (0-255)
            imgOut.pixels[index + 3] = 255;             // Alpha channel (fully opaque)
        }
    }

    imgOut.updatePixels();
    return imgOut;
}

/** HSV-RGB conversion */
function hsv_to_rgb(img) {
    var imgOut = createImage(img.width, img.height);

    imgOut.loadPixels();
    img.loadPixels();

    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {
            var index = (y * img.width + x) * 4;

            // Get HSV values
            var H = img.pixels[index + 0] / 255 * 360;      // Hue (0-360)
            var S = img.pixels[index + 1] / 255;            // Saturation (0-1)
            var V = img.pixels[index + 2] / 255;            // Value (0-1)

            // Calculate primary and secondary colors
            var Hex = H / 60; // Normalize H to [0, 6)
            var primaryColour = floor(Hex); // Integer part of Hex
            var secondaryColour = Hex - primaryColour; // Fractional part of Hex

            // Calculate intermediate values
            var a = (1 - S) * V;
            var b = (1 - S * secondaryColour) * V;
            var c = (1 - S * (1 - secondaryColour)) * V;

            // Calculate RGB based on primary color
            var R, G, B;
            switch (primaryColour) {
                case 0:
                    R = V;
                    G = c;
                    B = a;
                    break;
                case 1:
                    R = b;
                    G = V;
                    B = a;
                    break;
                case 2:
                    R = a;
                    G = V;
                    B = c;
                    break;
                case 3:
                    R = a;
                    G = b;
                    B = V;
                    break;
                case 4:
                    R = c;
                    G = a;
                    B = V;
                    break;
                case 5:
                    R = V;
                    G = a;
                    B = b;
                    break;
                default:
                    R = 0;
                    G = 0;
                    B = 0;
                    break;
            }

            // Store RGB values in the output image
            imgOut.pixels[index + 0] = R * 255; // Red (0-255)
            imgOut.pixels[index + 1] = G * 255; // Green (0-255)
            imgOut.pixels[index + 2] = B * 255; // Blue (0-255)
            imgOut.pixels[index + 3] = 255;     // Alpha channel (fully opaque)
        }
    }

    imgOut.updatePixels();
    return imgOut;
}

//=================================================================================================================

/** RGB-CMYK conversion (Cyan Magenta Yellow (Black))*/
function rgb_to_cmyk(img)
{
    var imgOut = createImage(img.width, img.height);
        
    imgOut.loadPixels();
    img.loadPixels();
    
    for (var x=0; x<img.width; x++){
        for (var y=0; y<img.height; y++){
            
            var index = (y*img.width + x) * 4;
        
            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];
            
            // RGB-CMY
            var cyan = constrain(1 - (r / 255), 0, 1);       // 0-100%, [0, 1]
            var magenta = constrain(1 - (g / 255), 0, 1);    // 0-100%, [0, 1]
            var yellow = constrain(1 - (b / 255), 0, 1);     // 0-100%, [0, 1]

            // CMY-CMYK
            var black = constrain(min(cyan, magenta, yellow), 0, 1); //0-100%, [0, 1]

            // Avoid division by zero
            if (black === 1) {
                cyan = 0;
                magenta = 0;
                yellow = 0;
            } else {
                cyan = (cyan - black) / (1 - black);
                magenta = (magenta - black) / (1 - black);
                yellow = (yellow - black) / (1 - black);
            }

            // Scale CMYK values [0, 1] to [0, 255] for display
            imgOut.pixels[index + 0] = cyan * 255;
            imgOut.pixels[index + 1] = magenta * 255;
            imgOut.pixels[index + 2] = yellow * 255;
            imgOut.pixels[index + 3] = black * 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}

/** CMYK-RGB conversion */
function cmyk_to_rgb(img) {
    var imgOut = createImage(img.width, img.height);

    imgOut.loadPixels();
    img.loadPixels();

    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {

            var index = (y * img.width + x) * 4;

            // Get CMYK values and normalize to [0, 1]
            var cyan = img.pixels[index + 0] / 255;    // Cyan [0, 1]
            var magenta = img.pixels[index + 1] / 255; // Magenta [0, 1]
            var yellow = img.pixels[index + 2] / 255;  // Yellow [0, 1]
            var black = img.pixels[index + 3] / 255;  // Black [0, 1]

            // CMYK to CMY
            cyan = min(1, (cyan * (1 - black) + black));
            magenta = min(1, (magenta * (1 - black) + black));
            yellow = min(1, (yellow * (1 - black) + black));

            // CMY to RGB
            var r = 1 - cyan;    // Red [0, 1]
            var g = 1 - magenta; // Green [0, 1]
            var b = 1 - yellow;  // Blue [0, 1]

            // Scale RGB values to [0, 255] for storage
            imgOut.pixels[index + 0] = r * 255; // Red
            imgOut.pixels[index + 1] = g * 255; // Green
            imgOut.pixels[index + 2] = b * 255; // Blue
            imgOut.pixels[index + 3] = 255;     // Alpha channel (fully opaque)
        }
    }

    imgOut.updatePixels();
    return imgOut;
}