let port; // do not remove or rename
let serial;
let serialData;
let spriteSheet;
let frameWidth = 64;
let frameHeight = 64;
let framesPerAnim = 15;

let animations = {
    walk: {start: 0, end: 14},
    sad: {start: 15, end: 29},
    idle: {start: 30, end: 44},
};

let state = "walk";
let frameIndex = 0;
let frameTimer = 0;
let frameDelay = 6;

let x, y;
let vx, vy;
let speed = 2;
let facingRight = true;

let bounds = {left: 500, right: 1660, top: 260, bottom: 310};
// Walk/idle timing
let stateTimer = 0;
let walkDuration = 120; // ~2 seconds
let idleDuration = 90;  // ~1.5 seconds


let grainLayer;
let grainOffsetX = 0;
let grainOffsetY = 0;

let lastFollowTime;   // timestamp of last mouse-follow
let followThreshold = 100; // pixels, distance to consider "following"
let timer = 0;        // time since last follow (ms)


let humDiv;
let followDiv;
//Humidity and followTime variables
let humidity = 60;
let followTime = 0;

// Buddy/ad popup
let popUp1;
let happyPopUp;
let lowWaterPopUp;
let superLowWaterPopUp;
let highWaterPopUp;
let needyPopUp;


let buddy = null;
let buddySpawned = false;
let buddyAttached = false;
let buddySpeed = 1.5;
let spawnRange = {min: -10, max: 110};
let buddyDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;


function preload() {
    // Load your sprite sheet exported from Aseprite
    spriteSheet = loadImage("./assets/plantAnimTestFinal.png");

    happyPopUp = loadImage("./assets/happy.png");
    lowWaterPopUp = loadImage("./assets/lowWater.png");
    superLowWaterPopUp = loadImage("./assets/superLowWater.png");
    highWaterPopUp = loadImage("./assets/highWater.png");
    needyPopUp = loadImage("./assets/needy.png");


}

function setup() {
    // Change this if you want a fixed size canvas
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.style('z-index', '1');   // bring it above other elements
    cnv.style('position', 'absolute');
    cnv.style('top', '0');
    cnv.style('left', '0');
    port = createSerial(); // creates the Serial Port

    lastFollowTime = millis(); // initialize timer

    // initial position & velocity
    x = random(bounds.left, bounds.right);
    y = random(bounds.top, bounds.bottom);
    vx = random(-speed, speed);
    vy = random(-speed, speed);

    const div = document.querySelector(".plant-feels-17d898d3d854")
    const rect = div.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.width / 2 * 1 / 4;

    grainLayer = createGraphics(width, height);
    grainLayer.noStroke();
    humDiv = select("#humidityVal");
    followDiv = select("#followTimeVal");


}

function draw() {

    clear();

    // Receive data from Arduino
    if (port.opened()) {
        serialData = port.readUntil("\n");
        // Only log and use data that has information, not empty signals
        if (serialData[0]) {
            console.log(serialData);
            humidity = serialData;
            humDiv.html(humidity);
        }
    }


    updateBehavior();
    updateAnimation();
    drawSprite();

    updateBuddy();
    drawBuddy();

    // for debugging
    // optional: visualize the walking area
    // rect(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);

    drawDynamicGrain();
    timer = millis() - lastFollowTime;
    // drawPixelOverlay(20, 50);

    // humDiv.html(humidity);
    followDiv.html("");  // clear the div

    followDiv.html(((timer / 1000).toFixed(1)) + "s", 10, 30);

}

function mousePressed() {
    if (!buddy) return;

    let buddyCX = buddy.x + buddy.width / 2;
    let buddyCY = buddy.y + buddy.height / 2;
    let mx = mouseX;
    let my = mouseY;

    // Check if mouse is over buddy
    if (mx > buddy.x && mx < buddy.x + buddy.sprite.width &&
        my > buddy.y && my < buddy.y + buddy.sprite.height) {
        buddyDragging = true;
        // store offset so buddy doesn’t jump
        dragOffsetX = mx - buddy.x;
        dragOffsetY = my - buddy.y;
    }
}

function mouseReleased() {
    buddyDragging = false;
}

function drawDynamicGrain() {
    // clear previous frame's grain
    grainLayer.clear();

    // draw random pixels
    let density = 5000; // number of grains per frame
    for (let i = 0; i < density; i++) {
        let alpha = random(30, 50);
        grainLayer.fill(random(255), alpha);
        let x = random(width);
        let y = random(height);
        grainLayer.rect(x, y, 2, 2);
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
        port.open();
    } else {
        // Otherwise, close the port
        port.close();
    }
}

function updateBehavior() {
    stateTimer++;

    // --- Spawn buddy if humidity is in range ---
    if (humidity >= spawnRange.min && humidity <= spawnRange.max) {
        if (!buddySpawned) {

            spawnBuddy(happyPopUp);
            buddySpawned = true;

        }
    } else {
        buddy = null;
        buddySpawned = false;
    }

    // --- HUMIDITY-BASED OVERRIDE ---
    // if humidity is below threshold → force sadness
    if (humidity <= 40) {
        state = "sad";
        vx = 0;
        vy = 0;
        return; // stop all other behavior
    } else if (80 > humidity > 40) {
        speed = 9;
    }

    // otherwise, NOT sad → resume normal system
    // ----------------------------------------------------

    // TIMER-BASED SADNESS (your existing rule)
    if ((timer / 1000).toFixed(1) > 60) {
        state = "sad";
        if (
            mouseX > bounds.left && mouseX < bounds.right &&
            mouseY > bounds.top && mouseY < bounds.bottom
        ) {
            let dx = mouseX - x;
            let dy = mouseY - y;
            let distToMouse = sqrt(dx * dx + dy * dy);

            if (distToMouse > 5) {
                vx = (dx / distToMouse) * speed;
                vy = (dy / distToMouse) * speed;
            }

            lastFollowTime = millis();
        }
        return;
    } else {
        // if recovered, go back to idle/walk naturally
        if (state === "sad") {
            state = "idle";
            stateTimer = 0;
        }
    }


    // ------- IDLE MODE -------
    if (state === "idle") {
        vx = 0;
        vy = 0;

        if (stateTimer > idleDuration) {
            pickNewDirection();
            state = "walk";
            stateTimer = 0;
        }
        return;
    }


    // ------- WALK MODE -------
    if (state === "walk") {

        // Move
        x += vx;
        y += vy;

        // Boundaries
        if (x < bounds.left) x = bounds.left;
        if (x > bounds.right - frameWidth) x = bounds.right - frameWidth;
        if (y < bounds.top) y = bounds.top;
        if (y > bounds.bottom - frameHeight) y = bounds.bottom - frameHeight;

        // Flip sprite instantly
        if (vx > 0) facingRight = true;
        else if (vx < 0) facingRight = false;

        // --- Mouse follow within bounds ---
        if (
            mouseX > bounds.left && mouseX < bounds.right &&
            mouseY > bounds.top && mouseY < bounds.bottom
        ) {
            let dx = mouseX - x;
            let dy = mouseY - y;
            let distToMouse = sqrt(dx * dx + dy * dy);

            if (distToMouse > 5) {
                vx = (dx / distToMouse) * speed;
                vy = (dy / distToMouse) * speed;
            }

            lastFollowTime = millis();

            return;
        }

        // After walking for some time → idle
        if (stateTimer > walkDuration) {
            state = "idle";
            stateTimer = 0;
        }

        return;
    }


}

// --- Spawn buddy near character ---
function spawnBuddy(sprite) {
    let safeDistance = 150;
    let angle = random(TWO_PI);
    let distance = random(safeDistance, safeDistance + 50);
    let offsetX = cos(angle) * distance;
    let offsetY = sin(angle) * distance;

    buddy = {
        x: random(bounds.left, bounds.right),
        y: random(200, bounds.bottom),
        width: sprite.width,
        height: sprite.height,
        attached: false,
        dragging: false,
        offsetX: 0,
        offsetY: 0,
        sprite: sprite // assign sprite here
    };
}


// --- Update buddy movement and collision ---
function updateBuddy() {
    if (!buddy) return;
    // Example: change sprite based on humidity
    if ((timer / 1000) > 60) {
        buddy.sprite = needyPopUp;
    } else {
        // choose sprite based on humidity
        if (humidity <= 20) buddy.sprite = superLowWaterPopUp;
        else if (humidity <= 40) buddy.sprite = lowWaterPopUp;
        else if (humidity <= 80) buddy.sprite = happyPopUp;
        else buddy.sprite = highWaterPopUp;
    }


    // If dragging, follow mouse
    if (buddyDragging) {
        buddy.x = mouseX - dragOffsetX;
        buddy.y = mouseY - dragOffsetY;
        return; // skip auto-stick or wandering while dragging
    }

    // --- Character center
    let charCX = x+ frameWidth*2;
    let charCY = y + frameHeight ;

    // --- Buddy center
    let buddyCX = buddy.x + buddy.width / 2;
    let buddyCY = buddy.y + buddy.height / 2;

    // distance-based collision
    let distToChar = dist(charCX, charCY, buddyCX, buddyCY);
    let stickThreshold = 60;

    if (distToChar < stickThreshold) {
        if (!buddyAttached) {
            buddyAttached = true;
            buddy.offsetX = buddy.x - x;
            buddy.offsetY = buddy.y - y;
        }
    } else {
        buddyAttached = false;
    }

    // Move buddy if attached
    if (buddyAttached) {
        buddy.x = x + buddy.offsetX;
        buddy.y = y + buddy.offsetY;
    }
}


// --- Draw buddy ---
function drawBuddy() {
    if (!buddy) return;
    push();
    translate(buddy.x + buddy.width / 2, buddy.y + buddy.height / 2);
    imageMode(CENTER);
    image(buddy.sprite, 0, 0, buddy.sprite.width, buddy.sprite.height);

    pop();

}


function removeBuddy() {
    buddy = null;
    buddyAttached = false;
    buddySpawned = false;
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

