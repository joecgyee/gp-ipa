//=================================================================================================================

/* Input handlers */

//=================================================================================================================

function keyPressed()
{
    if (keyCode == 32) // space bar
    {
        snapshot = createImage(capture.width, capture.height);
        snapshot.copy(capture, 0, 0, capture.width, capture.height, 0, 0, capture.width, capture.height);

        faces = detector.detect(snapshot.canvas);
    }
    else if (keyCode == 82) // R
    {
        window.location.reload();
    }
    else if (keyCode == 49) // 1
    {
        faceFilterOption = 1; // greyscale
    }
    else if (keyCode == 50) // 2
    {
        faceFilterOption = 2; // blur
    }
    else if (keyCode == 51) // 3
    {
        faceFilterOption = 3; // HSV
    }
    else if (keyCode == 52) // 4
    {
        faceFilterOption = 4; // pixelated
    }
}

//=================================================================================================================

function mousePressed() 
{
    // Check if a snapshot exists
    if (!snapshot) return;

    // Define image positions and save if clicked
    checkAndSaveImage(snapshot, col1, row1, w, h, "original_image.png");
    checkAndSaveImage(greyscale_img, col2, row1, w, h, "greyscale_image.png");

    checkAndSaveImage(red_img, col1, row2, w, h, "red_tint_image.png");
    checkAndSaveImage(green_img, col2, row2, w, h, "green_tint_image.png");
    checkAndSaveImage(blue_img, col3, row2, w, h, "blue_tint_image.png");

    checkAndSaveImage(red_threshold_img, col1, row3, w, h, "red_threshold_image.png");
    checkAndSaveImage(green_threshold_img, col2, row3, w, h, "green_threshold_image.png");
    checkAndSaveImage(blue_threshold_img, col3, row3, w, h, "blue_threshold_image.png");

    checkAndSaveImage(snapshot, col1, row4, w, h, "original2_image.png");
    checkAndSaveImage(hsv_img, col2, row4, w, h, "hsv_image.png");
    checkAndSaveImage(cmyk_img, col3, row4, w, h, "cmyk_image.png");

    checkAndSaveImage(snapshot, col1, row5, w, h, "original3_image.png");
    checkAndSaveImage(hsv_thereshold_img, col2, row5, w, h, "hsv_threshold_image.png");
    checkAndSaveImage(cmyk_threshold_img, col3, row5, w, h, "cmyk_threshold_image.png");

    checkAndSaveImage(inv_colorshift_img, col1, row6, w, h, "inverted_colourShift_image.png");
    checkAndSaveImage(symmetry_img, col2, row6, w, h, "symmetry_image.png");
    checkAndSaveImage(wave_distortion_img, col3, row6, w, h, "wave_distortion_image.png");
}

// Function to check if the mouse click is inside an image and save it
function checkAndSaveImage(img, x, y, w, h, filename) {
    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
        save(img, filename);
    }
}

//=================================================================================================================

function mouseMoved() {
    let hovering = false;

    if(snapshot)
    {
        hovering ||= isMouseOver(col1, row1, w, h);
        hovering ||= isMouseOver(col2, row1, w, h);
        hovering ||= isMouseOver(col1, row2, w, h);
        hovering ||= isMouseOver(col2, row2, w, h);
        hovering ||= isMouseOver(col3, row2, w, h);
        hovering ||= isMouseOver(col1, row3, w, h);
        hovering ||= isMouseOver(col2, row3, w, h);
        hovering ||= isMouseOver(col3, row3, w, h);
        hovering ||= isMouseOver(col1, row4, w, h);
        hovering ||= isMouseOver(col2, row4, w, h);
        hovering ||= isMouseOver(col3, row4, w, h);
        hovering ||= isMouseOver(col1, row5, w, h);
        hovering ||= isMouseOver(col2, row5, w, h);
        hovering ||= isMouseOver(col3, row5, w, h);
        hovering ||= isMouseOver(col1, row6, w, h);
        hovering ||= isMouseOver(col2, row6, w, h);
        hovering ||= isMouseOver(col3, row6, w, h);
    }

    if (hovering) {
        cursor(HAND); // Change cursor to hand icon
    } else {
        cursor(ARROW); // Reset cursor to default
    }
}

// Function to check if mouse is over an image
function isMouseOver(x, y, w, h) {
    return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}
