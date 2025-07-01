//=================================================================================================================

/* Main sketch.js */

//=================================================================================================================

function preload() {
    faceReplacement = loadImage('meme.png'); 
}

//=================================================================================================================

function setup() 
{
    createCanvas(3*w+2*space, 6*h+7*space);
    pixelDensity(1); 
    
    setup_graphicsBefore();
    setup_graphicsAfter();

    capture = createCapture(VIDEO);
    capture.size(w, h);
    capture.hide();

    createSliders();

    var scaleFactor = 1.2;
    detector = new objectdetect.detector(w, h, scaleFactor, classifier);

}

//=================================================================================================================

function draw() 
{
    background(0);
    
    fill(255);
    textAlign(CENTER);

    if (!snapshot) 
    {
        image(graphics_before_snapshot, 0, 0); // Texts
        image(capture, width/2-200, space, 400, 300);
    }
    else
    {
        processSnapshot(); // in '/filters.js'
        image(graphics_after_snapshot, 0, 0); // Texts
        
        slidersPositions();

        image(snapshot, col1, row1, w, h); 
        image(greyscale_img, col2, row1, w, h);

        image(red_img, col1, row2, w, h);
        image(green_img, col2, row2, w, h);
        image(blue_img, col3, row2, w, h);

        image(red_threshold_img, col1, row3, w, h);
        image(green_threshold_img, col2, row3, w, h);
        image(blue_threshold_img, col3, row3, w, h);
        
        image(snapshot, col1, row4, w, h);
        image(hsv_img, col2, row4, w, h);
        image(cmyk_img, col3, row4, w, h);

        image(snapshot, col1, row5, w, h);
        drawFaces(faceFilterOption);
        image(hsv_thereshold_img, col2, row5, w, h);
        image(cmyk_threshold_img, col3, row5, w, h);

        image(inv_colorshift_img, col1, row6, w, h);
        image(symmetry_img, col2, row6, w, h);
        image(wave_distortion_img, col3, row6, w, h);
    }
}