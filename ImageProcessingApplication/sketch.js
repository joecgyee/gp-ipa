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
        image(graphics_after_snapshot, 0, 0); // Texts
        
        slidersPositions();

        image(snapshot, col1, row1, w, h); 
        image(greyscaleFilter(snapshot), col2, row1, w, h);

        image(rgbFilter(snapshot, 1, 0.5, 0.5), col1, row2, w, h);
        image(rgbFilter(snapshot, 0.5, 1, 0.5), col2, row2, w, h);
        image(rgbFilter(snapshot, 0.5, 0.5, 1), col3, row2, w, h);

        image(rgb_thresholdFilter(snapshot, 'red', red_thresholdSlider), col1, row3, w, h);
        image(rgb_thresholdFilter(snapshot, 'green', green_thresholdSlider), col2, row3, w, h);
        image(rgb_thresholdFilter(snapshot, 'blue', blue_thresholdSlider), col3, row3, w, h);
        
        image(snapshot, col1, row4, w, h);
        image(rgb_to_hsv(snapshot), col2, row4, w, h);
        image(rgb_to_cmyk(snapshot), col3, row4, w, h);

        image(snapshot, col1, row5, w, h);
        drawFaces(faceFilterOption);
        image(hsv_thresholdFilter(rgb_to_hsv(snapshot)), col2, row5, w, h);
        image(cmyk_thresholdFilter(rgb_to_cmyk(snapshot)), col3, row5, w, h);

        image(invertAndColorShiftFilter(snapshot), col1, row6, w, h);
        image(symmetryFilter(snapshot), col2, row6, w, h);
        image(waveDistortionFilter(snapshot), col3, row6, w, h);
    }
}