let port; // do not remove or rename
let serialData;
let spriteSheet;
let frameWidth = 64;
let frameHeight = 64;
let framesPerAnim = 15;

let animations = {
    walk: { start: 0, end: 14 },
    sad: { start: 15, end: 29 },
    idle: { start: 30, end: 44 },
};

let state = "walk";
let frameIndex = 0;
let frameTimer = 0;
let frameDelay = 6;

let x, y;
let vx, vy;
let speed = 2;
let facingRight = true;

let bounds = { left: 500, right: 1660, top: 260, bottom: 310 };
// Walk/idle timing
let stateTimer = 0;
let walkDuration = 120; // ~2 seconds
let idleDuration = 90;  // ~1.5 seconds


let grainLayer;
let grainOffsetX = 0;
let grainOffsetY = 0;



let humDiv;
let tempDiv;
//Humidity and Temperature variables
let humidity = 0;
let temperature = 0;

function preload() {
    // Load your sprite sheet exported from Aseprite
    spriteSheet = loadImage("./assets/plantAnimTestFinal.png");
}

function setup() {
  // Change this if you want a fixed size canvas
  let cnv = createCanvas(windowWidth, windowHeight);
    cnv.style('z-index', '10');   // bring it above other elements
    cnv.style('position', 'absolute');
    cnv.style('top', '0');
    cnv.style('left', '0');
  port = createSerial(); // creates the Serial Port
    // initial position & velocity
    x = random(bounds.left, bounds.right);
    y = random(bounds.top, bounds.bottom);
    vx = random(-speed, speed);
    vy = random(-speed, speed);

    const div = document.querySelector(".plant-feels-17d898d3d854")
    const rect = div.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.width/2 * 1/4;

    grainLayer = createGraphics(width, height);
    grainLayer.noStroke();

    humDiv = select("#humidityVal");
    tempDiv = select("#temperatureVal");

}

function draw() {

clear();
  // Receive data from Arduino
  if (port.opened()) {
    serialData = port.readUntil("\n");
    // Only log and use data that has information, not empty signals
    if (serialData[0]) {
      console.log(serialData);
    }
  }


    updateBehavior();
    updateAnimation();
    drawSprite();

     // for debugging
    // optional: visualize the walking area
    // rect(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);

    drawDynamicGrain();
    humDiv.html(humidity);
    tempDiv.html(temperature);

}

function drawDynamicGrain() {
    // clear previous frame's grain
    grainLayer.clear();

    // draw random pixels
    let density = 5000; // number of grains per frame
    for (let i = 0; i < density; i++) {
        let alpha = random(20, 50);
        grainLayer.fill(random(255), alpha);
        let x = random(width);
        let y = random(height);
        grainLayer.rect(x, y, 1, 1);
    }

    // shift the layer slightly to create movement
    grainOffsetX += random(-1, 1);
    grainOffsetY += random(-1, 1);

    image(grainLayer, grainOffsetX, grainOffsetY);
}
// DO NOT REMOVE THIS FUNCTION
function connectBtnClicked() {
  // When button is clicked, check if serial port is already opened
  if (!port.opened()) {
    // If not already, open the port with baud rate 9600
    // Make sure baud rate here matches settings in Arduino
    port.open(9600);
  } else {
    // Otherwise, close the port
    port.close();
  }
}


function updateBehavior() {
    stateTimer++;

    if (state === "idle") {
        vx = 0;
        vy = 0;

        if (stateTimer > idleDuration) {
            // pick a new direction after idling
            pickNewDirection();
            state = "walk";
            stateTimer = 0;
        }
    } else if (state === "walk") {
        // move position
        x += vx;
        y += vy;

        // bounds checking
        if (x < bounds.left) x = bounds.left;
        if (x > bounds.right - frameWidth) x = bounds.right - frameWidth;
        if (y < bounds.top) y = bounds.top;
        if (y > bounds.bottom - frameHeight) y = bounds.bottom - frameHeight;

        // Flip instantly when direction changes horizontally
        if (vx > 0) facingRight = true;
        else if (vx < 0) facingRight = false;

        // Walk toward mouse if it's inside bounds
        if (
            mouseX > bounds.left && mouseX < bounds.right &&
            mouseY > bounds.top && mouseY < bounds.bottom
        ) {
            circle(mouseX, mouseY, 30);
            let dx = mouseX - x;
            let dy = mouseY - y;
            let distToMouse = sqrt(dx * dx + dy * dy);
            if (distToMouse > 5) {
                vx = (dx / distToMouse) * speed;
                vy = (dy / distToMouse) * speed;
            }
        // after walking for a while, pause
        }
        else if (stateTimer > walkDuration) {
            state = "idle";
            stateTimer = 0;
        }

    }
}

function pickNewDirection() {
    // pick random direction and normalize
    let angle = random(TWO_PI);
    vx = cos(angle) * speed;
    vy = sin(angle) * speed;
}

function updateAnimation() {
    frameTimer++;
    if (frameTimer >= frameDelay) {
        frameTimer = 0;
        frameIndex++;
        if (frameIndex > animations[state].end || frameIndex < animations[state].start) {
            frameIndex = animations[state].start;
        }
    }
}

function drawSprite() {
    let sx = (frameIndex % 15) * frameWidth;
    let sy = floor(frameIndex / 15) * frameHeight;

    push();
    translate(x + frameWidth / 2, y + frameHeight / 2);
    if (state === "walk" && !facingRight) scale(-1, 1);
    imageMode(CENTER);
    image(
        spriteSheet,
        0, 0,
        164, 164,
        sx, sy,
        frameWidth, frameHeight
    );
    pop();
}