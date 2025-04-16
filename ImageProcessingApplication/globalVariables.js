//=================================================================================================================

/* Global variables */

//=================================================================================================================

var w = 160,
    h = 120,
    space = 50; // To leave some spaces between images
    
//== Coordinates =================================================================================================
    
    /* y */ 
    var row1 = space, 
        row2 = 2*space+h, 
        row3 = 3*space+2*h, 
        row4 = 4*space+3*h, 
        row5 = 5*space+4*h,
        row6 = 6*space+5*h;
    /* x */ 
    var col1 = 0, 
        col2 = space+w, 
        col3 = 2*space+2*w;

//=================================================================================================================

var snapshot;

var detector;
var classifier = objectdetect.frontalface;
var faces = [];
var faceReplacement; // The image to replace detected face
var faceFilterOption = 1; // Default to option 1: greyscaleFilter

//== Sliders =======================================================================================================

var red_thresholdSlider,
    green_thresholdSlider,
    blue_thresholdSlider,
    hsv_thresholdSlider,
    cmyk_thresholdSlider;

function createSliders()
{
    red_thresholdSlider = createSlider(0, 255, 255);
    green_thresholdSlider = createSlider(0, 255, 255);
    blue_thresholdSlider = createSlider(0, 255, 255);
    hsv_thresholdSlider = createSlider(0, 255, 0);
    cmyk_thresholdSlider = createSlider(0, 255, 0);
}

function slidersPositions()
{
    red_thresholdSlider.position(10, row3-space/2);
    green_thresholdSlider.position(10+col2, row3-space/2);
    blue_thresholdSlider.position(10+col3, row3-space/2);
    hsv_thresholdSlider.position(10+col2, row5-space/2);
    cmyk_thresholdSlider.position(10+col3, row5-space/2);
}

//== Graphics (Texts) =============================================================================================

// To "draw" text once without redrawing it every frame
var graphics_before_snapshot; 
var graphics_after_snapshot;

function setup_graphicsBefore()
{
    graphics_before_snapshot = createGraphics(width, height);
    graphics_before_snapshot.fill(255);
    graphics_before_snapshot.textAlign(CENTER);
    graphics_before_snapshot.textSize(20);
    graphics_before_snapshot.text("IMAGE PROCESSING APPLICATION", width/2, 20);
    graphics_before_snapshot.textSize(12);
    graphics_before_snapshot.text("Press `SPACEBAR`: take snapshot", width/2, 40);  
}

function setup_graphicsAfter()
{
    graphics_after_snapshot = createGraphics(width, height);
    graphics_after_snapshot.fill(255);
    graphics_after_snapshot.textAlign(CENTER);

    graphics_after_snapshot.textSize(20);  
    graphics_after_snapshot.text("IMAGE PROCESSED", width/2, 20);

    graphics_after_snapshot.textAlign(LEFT);
    graphics_after_snapshot.textSize(12);
    graphics_after_snapshot.text("Press `R`: refresh", width*3/4, 15);  
    graphics_after_snapshot.text("Press `1`: greyscale face", width*3/4, 30);  
    graphics_after_snapshot.text("Press `2`: blur face", width*3/4, 45);  
    graphics_after_snapshot.text("Press `3`: hsv face", width*3/4, 60);  
    graphics_after_snapshot.text("Press `4`: pixelate face", width*3/4, 75);  
    graphics_after_snapshot.text("Click image to save", 0, 15);  
    
    graphics_after_snapshot.text("Your image:", col1, row1-5);  
    graphics_after_snapshot.text("Greyscale (20% brighter):", col2, row1-5);  
    graphics_after_snapshot.text("Red channel:", col1, row2-5);  
    graphics_after_snapshot.text("Green channel:", col2, row2-5);  
    graphics_after_snapshot.text("Blue channel:", col3, row2-5);  
    graphics_after_snapshot.text("Red threshold:", col1, row3-5);  
    graphics_after_snapshot.text("Green threshold:", col2, row3-5);  
    graphics_after_snapshot.text("Blue threshold:", col3, row3-5);  
    graphics_after_snapshot.text("Your image:", col1, row4-5);  
    graphics_after_snapshot.text("RGB-HSV:", col2, row4-5);  
    graphics_after_snapshot.text("RGB-CMYK:", col3, row4-5);  
    graphics_after_snapshot.text("Face detection:", col1, row5-5);  
    graphics_after_snapshot.text("HSV threshold:", col2, row5-5);  
    graphics_after_snapshot.text("CMYK threshold:", col3, row5-5);  
    graphics_after_snapshot.text("Invert & colour shift:", col1, row6-5);  
    graphics_after_snapshot.text("Symmetry:", col2, row6-5);  
    graphics_after_snapshot.text("Wave distort:", col3, row6-5);  
}
