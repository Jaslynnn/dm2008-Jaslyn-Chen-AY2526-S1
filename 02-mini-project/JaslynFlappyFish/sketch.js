// DM2008 — Mini Project
// FLAPPY BIRD (Starter Scaffold)

// TODO:
//  1) Done Add flap control in handleInput() (space / ↑ to jump)
//  2) Done Detect collisions between the bird and pipes → game over
//  3) Done Add scoring when you pass a pipe
//  4) Done (Stretch) Add start/pause/game-over states
//  5) Done (Stretch) Add sound effects
//  6) (Stretch) Improve graphics (draw the bird and pipes better)
//  7) (Stretch) Make it mobile friendly (touch to flap, scale to fit screen)

//OtherStuff
//Create start game page
//Add rotation with the flap

/* ----------------- Globals ----------------- */
let font;

function preload() {
    font = loadFont("./Fonts/Tomorrow-Regular.ttf");
}

let bird;
let pipes = [];
let seaweeds = [];

let bubbles = [];
let bubbleSpawnCounter = 0;
const BUBBLE_SPAWN_RATE = 30;
let backBubbles = [];
let backBubbleSpawnCounter = 0;
const BACK_BUBBLE_SPAWN_RATE = 3; // adjust for density


let spawnCounter = 0; // simple timer
const SPAWN_RATE = 90; // ~ every 90 frames at 60fps ≈ 1.5s
let PIPE_SPEED = 2.5;
const PIPE_GAP = 180; // gap height (try 100–160)
const PIPE_W = 60;

//Take variable currentGameState to change between BeforeGame, GameStart, GameOver
let currentGameState = 0;
let score = 0;
let highScore = 0;

//Text transition animations


/* ----------------- Setup & Draw ----------------- */
function setup() {
    createCanvas(480, 640);
    noStroke();
    textFont(font);
    textSize(30);
    textAlign(CENTER, CENTER);
    bird = new Bird(width / 2, height / 2);
    pipes = [new Pipe(width)];
    for (let i = 0; i < 7; i++) {
        let x = 40 + i * 60 + random(-10, 10) + random(bird.pos.x) * 0.1;
        let h = random(60, height / 2);
        let c = color(5, 199 + random(40), 192, 100);
        seaweeds.push(new Seaweed(x, height, h, c));
    }

    // Start with one pipe so there’s something to see
}

function draw() {
    background(3, 21, 31);
    // 2) update world
    for (let s of seaweeds) s.show();
    bird.update();
    // spawn bubbles from fish mouth
// spawn bubbles from fish mouth
    bubbleSpawnCounter++;
    if (bubbleSpawnCounter >= BUBBLE_SPAWN_RATE) {
        let mouthX = bird.pos.x + 15;
        let mouthY = bird.pos.y + 4;
        bubbles.push(new Bubble(mouthX, mouthY, 0)); // type 0 for mouth bubbles
        bubbleSpawnCounter = 0;
    }
    // spawn bubbles from fish's back


    switch (currentGameState) {
        case 0:
            // BeforeGame
            let titleFloat = sin(frameCount * 0.04) * 1; // for Flappy Fish float
            let birdFloat = sin(frameCount * 0.05 + PI / 4) * 0.2; // for BirdFloat
            bird.pos.y += birdFloat;

            // Title
            fill(240);
            textSize(40);
            text("Flappy Fish", width / 2, height / 5 + titleFloat);

            // Pulsing opacity for subtitle
            let opacity = map(sin(frameCount * 0.05), -1, 1, 80, 255);
            // opacity oscillates smoothly between 120 and 255

            fill(240, opacity); // set color with alpha
            textSize(16);
            text("Press SPACE to start", width / 2, (height / 4) * 3);

            break;

        case 1:
            //GameStart
            PIPE_SPEED = 2.5 + score * 0.05;
            spawnCounter++;
            if (spawnCounter >= SPAWN_RATE) {
                pipes.push(new Pipe(width + 40));
                spawnCounter = 0;
            }
            pipeSpeed = 2.5 + score * 0.05;
            // update + draw pipes
            for (let i = pipes.length - 1; i >= 0; i--) {
                pipes[i].update();
                pipes[i].show();
                pipes[i].hitBird(bird);
                for (let j = bubbles.length - 1; j >= 0; j--) {
                    pipes[i].hitBubbles(bubbles[j]);
                }
                for (let k = backBubbles.length - 1; k >= 0; k--) {
                    pipes[i].hitBubbles(backBubbles[k]);
                }

                if (pipes[i].offscreen()) {
                    pipes.splice(i, 1);
                }
            }
            push();
            strokeWeight(2);
            stroke(0);
            pop();
            backBubbleSpawnCounter++;
            if (backBubbleSpawnCounter >= BACK_BUBBLE_SPAWN_RATE) {
                let backX = bird.pos.x - 20;  // slightly behind fish
                let backY = bird.pos.y + random(10);   // slightly below fish center
                backBubbles.push(new Bubble(backX, backY, 1));
                backBubbleSpawnCounter = 0;
            }
            fill(255);
            textSize(30);
            text(score, width / 2, height / 8);
            textSize(16);
            text("High Score : " + highScore, width / 2, (height / 4) * 3.5);
            break;

        case 2:
            //GameOver
            bird.pos.x += bird.vel.x;
            bird.pos.y -= bird.vel.y;

            rectMode(CENTER);
            fill(240);
            textSize(16);
            text("High Score : " + highScore, width / 2, (height / 4) * 2);
            text("Press SPACE to Restart", width / 2, (height / 4) * 3);
            textSize(20);
            text("Score:", width / 2, (height / 4));
            textSize(50);
            text(score, width / 2, height / 3);
            let birdFloat2 = sin(frameCount * 0.05 + PI / 4) * 0.1; // for BirdFloat
            bird.pos.y += birdFloat2;


            break;
    }
// update and draw bubbles
    for (let i = bubbles.length - 1; i >= 0; i--) {
        bubbles[i].update();
        bubbles[i].show();
        if (bubbles[i].isDead()) {
            bubbles.splice(i, 1);
        }
    }
    // update and draw back bubbles
    for (let i = backBubbles.length - 1; i >= 0; i--) {
        backBubbles[i].update();
        backBubbles[i].show();
        if (backBubbles[i].isDead()) {
            backBubbles.splice(i, 1);
        }
    }


    // 3) draw bird last so it’s on top
    bird.show();
}

/// javascript
// javascript
// javascript
// javascript
// javascript
function keyPressed() {
    if (key === " ") {
        if (currentGameState === 0) {
            score = 0;
            pipes = [new Pipe(width)];
            spawnCounter = 0;
            bird = new Bird(width / 2, height / 2);
            currentGameState = 1;
            backBubbleSpawnCounter++;
            if (backBubbleSpawnCounter >= BACK_BUBBLE_SPAWN_RATE) {
                let backX = bird.pos.x - 20;  // slightly behind fish
                let backY = bird.pos.y + random(10);   // slightly below fish center
                backBubbles.push(new Bubble(backX, backY, 1));

                backBubbleSpawnCounter = 0;
            }
        } else if (currentGameState === 1) {
            bird.flap();
        } else if (currentGameState === 2) {
            score = 0;
            pipes = [];
            spawnCounter = 0;
            bird = new Bird(width / 2, height / 2);
            currentGameState = 0;

            bubbles = [];
            bubbleSpawnCounter = 0;
            backBubbles = [];
            backBubbleSpawnCounter = 0;


        }
    }
}


/* ----------------- Classes ----------------- */
class Bird {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.r = 16; // for collision + draw
        this.gravity = 0.45; // constant downward force
        this.flapStrength = -8.0; // negative = upward
        this.rotation = 0;
    }

    applyForce(fy) {
        this.acc.y += fy;
    }

    flap() {
        // instant upward kick
        this.vel.y = this.flapStrength;
        this.rotation = -PI / 4.5; // tilt up on flap
        push();
        translate(this.pos.x - 10, this.pos.y);
        rotate(QUARTER_PI / 2);
        pop();
    }

    update() {

        if (this.rotation < 0) {
            this.rotation += 0.03; // slowly return to neutral
            if (this.rotation > 0) this.rotation = 0;
        }
        // gravity
        if (currentGameState == 1) {

            this.applyForce(this.gravity);
        }

        // integrate
        if (currentGameState != 2) {
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }

        // keep inside canvas vertically (simple constraints)
        if (this.pos.y < this.r) {
            this.pos.y = this.r;
            this.vel.y = 0;
        }
        if (this.pos.y > height - this.r) {
            this.pos.y = height - this.r;
            this.vel.y = 0;

        }
    }

    show() {
        fill(255, 203, 101);
        //MainBody
        push();
        rectMode(CORNER);
        translate(this.pos.x - this.r, this.pos.y);
        rotate(this.rotation);
        ellipse(
            this.r,
            0,
            this.r * 2 + this.vel.x,
            this.r * 2 + this.vel.y / 2
        );

        if (currentGameState === 0 || currentGameState === 1) {

            // translate(-17, this.pos.y);
            rotate(13);
            ellipse(0, 0, this.r * 0.9 + this.vel.x, this.r * 0.6 + this.vel.y / 2);
            // translate(this.pos.x - 17, this.pos.y + 7);
            rotate(-13);
            ellipse(0, 5, this.r * 0.9 + this.vel.x, this.r * 0.6 + this.vel.y / 2);



            fill(240);
            circle(
                22 + this.vel.x,
                -4 - (this.vel.y / 3) * 2,
                10
            );
            if (currentGameState === 0) {
                fill(0);
                circle(
                    22 + mouseX / this.pos.x,
                    -4 + mouseY / this.pos.y,
                    4
                );
            }
            if (currentGameState === 1) {
                fill(0);
                circle(22, -4, 4);
            }
            fill(240, 96, 91);
            ellipse(
                13 + this.vel.x,
                -(this.vel.y / 3) +4,
                15,
                10 + this.vel.y / 5
            );


        }
        if (currentGameState === 2) {
            ellipse(0, 0, this.r * 0.9 + this.vel.x, this.r * 0.6 + this.vel.y / 2);
            // translate(this.pos.x - 17, this.pos.y + 7);
            ellipse(0, -5, this.r * 0.9 + this.vel.x, this.r * 0.6 + this.vel.y / 2);
            fill(240);
            circle(
                22 + this.vel.x,
                (this.vel.y / 3) * 2,
                10
            );
            fill(0);
            circle(22, 0, 4);
            fill(240, 96, 91);
            ellipse(
                13 + this.vel.x,
                -5,
                15,
                10 + this.vel.y / 5
            );


        }


        //Cheeks

        pop();
    }

}

class Pipe {
    constructor(x) {
        this.x = x;
        this.w = PIPE_W;
        this.speed = PIPE_SPEED;

        // randomize gap position
        const margin = 40;
        const gapY = random(margin, height - margin - PIPE_GAP);

        this.topBase = gapY; // store base position
        this.bottomBase = gapY + PIPE_GAP;

        this.top = this.topBase;
        this.bottom = this.bottomBase;

        this.passed = false; // for scoring once per pipe

        // For vertical movement
        this.verticalPhase = random(TWO_PI);
        this.verticalOffset = 0;
        this.verticalAmplitude = 40; // max up/down movement
        this.verticalSpeed = 0.02;   // speed of oscillation
        this.currentAmplitude = 0;
    }

    update() {

        this.x -= this.speed;

        // Only move up/down if score > 15
        // In the update() method
        if (!this.passed && this.x + this.w < bird.pos.x) {
            score += 1;
            this.passed = true;
            if (score > highScore) {
                highScore = score;
            }
        }
        if (score > 3) {
            this.currentAmplitude = lerp(this.currentAmplitude, this.verticalAmplitude, 0.05);
        } else {
            this.currentAmplitude = lerp(this.currentAmplitude, 0, 0.1);
        }
        this.verticalOffset = sin(frameCount * this.verticalSpeed + this.verticalPhase) * this.currentAmplitude;
        this.top = this.topBase + this.verticalOffset + score*0.1;
        this.bottom = this.bottomBase + this.verticalOffset + score*0.1;
    }

    show() {
        if (currentGameState == 1) {
            fill(27, 161, 157);
            ellipse(this.x + this.w / 2, this.top, this.w, 20); // top pipe
            rectMode(CORNER);
            rect(this.x, 0, this.w, this.top);
            fill(3, 135, 131);
            ellipse(this.x + this.w / 2, this.top, this.w, 20);
            rect(this.x, this.bottom, this.w, height - this.bottom);
            ellipse(this.x + this.w / 2, this.bottom, this.w, 20);
        }
    }


    offscreen() {
        // look at MDN to understand what 'return' does
        // we will learn more about this in Week 6
        return this.x + this.w < 0;
    }

    hitBubbles(bubble) {

        const bubbleCollideTop = bubble.pos.y - bubble.size / 2 < this.top;
        const bubbleCollideBottom = bubble.pos.y + bubble.size / 2 > this.bottom;
        if (bubble.collides > 0.5) {
            if (bubbleCollideTop || bubbleCollideBottom) {
                // Remove bubble on collision
                // bubble.isDead = true;
                bubble.vel.y *= -1; // Move bubble off-screen
                bubble.vel.y += 0.02; // simulate buoyancy
                bubble.alpha -= 3;
            }

        }
        return bubbleCollideTop && bubbleCollideBottom;

    }

    hitBird(bird) {
        const withinX = bird.pos.x + bird.r > this.x && bird.pos.x - bird.r < this.x + this.w;
        const aboveGap = bird.pos.y - bird.r < this.top;
        const belowGap = bird.pos.y + bird.r > this.bottom;
        let d = dist(this.x + this.w / 2, this.bottom, bird.pos.x, bird.pos.y);

        if (withinX && (aboveGap || belowGap || d < this.w / 2 + bird.r)) {
            currentGameState = 2; // Game over
            return true;
        }
        return false;
    }
}

class Bubble {
    constructor(x, y, type) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-0.4, 0.2), random(-2, -1)); // slight sideways drift + upward motion
        this.size = random(8, 12);
        this.alpha = 80;
        this.shrinkRate = random(0.04, 0.07);
        this.type = type;
        this.collides = random(0, 1)

    }

    update() {
        this.pos.add(this.vel);

        if (this.type === 0) {
            this.vel.x += random(-0.01, 0.03); // gentle wobble
            this.vel.y -= random(-0.1, 0.5);
            this.alpha -= random(0.8); // fade out
        }
        if (this.type === 1) {
            this.size = random(3, 9);
            this.vel.x += random(-0.2, 0.03);
            // this.vel.y += random(-0.5, 0.5);
            this.alpha -= random(2.8); // fade out
        }


        this.size -= this.shrinkRate; // shrink slowly (pop effect)
    }

    show() {

        //stroke(255);
        //strokeWeight(0.1);
        if (this.type === 0) {
            fill(240, 255, 255, this.alpha);
        }

        ellipse(this.pos.x, this.pos.y, this.size);
        if (this.type === 1) {
            fill(220, 255, 255, this.alpha);

        }

    }

    isDead() {
        return this.alpha <= 0 || this.size <= 0;
    }
}

// Add this class to your sketch.js
class Seaweed {
    constructor(x, baseY, height, color) {
        this.x = x;
        this.baseY = baseY;
        this.height = height;
        this.color = color;
        this.waveSpeed = random(0.01, 0.03);
        this.waveOffset = random(500);
        this.width = 9;
    }

    show() {
        fill(this.color);
        noStroke();
        beginShape();
        let rightEdge = [];
        let leftEdge = [];
        // Right edge (upwards)
        for (let y = 0; y <= this.height; y += 5) {
            let angle = this.waveOffset + frameCount * this.waveSpeed + y * 0.08;
            let sway = sin(angle) * map(y, 0, this.height, 0, this.width);
            let px = this.x + sway + this.width + mouseX * 0.01 / 2;
            let py = this.baseY + mouseY * 0.01 - y;
            rightEdge.push([px, py]);
            vertex(px, py);
        }
        // Save tip points
        let tipRight = rightEdge[rightEdge.length - 1];
        // Left edge (upwards, for tip)
        for (let y = this.height; y >= 0; y -= 5) {
            let angle = this.waveOffset + frameCount * this.waveSpeed + y * 0.08 + PI;
            let sway = cos(angle) * map(y, 0, this.height, 0, this.width);
            let px = this.x + sway - this.width / 2;
            let py = this.baseY - y;
            leftEdge.push([px, py]);
        }
        let tipLeft = leftEdge[0];
        // Draw rounded tip (semicircle) from right tip to left tip
        let tipCenterX = (tipRight[0] + tipLeft[0]) / 2;
        let tipCenterY = (tipRight[1] + tipLeft[1]) / 2;
        let tipRadius = dist(tipRight[0], tipRight[1], tipLeft[0], tipLeft[1]) / 2;
        for (let a = 0; a <= PI; a += PI / 8) {
            let tx = tipCenterX + cos(a) * tipRadius;
            let ty = tipCenterY - sin(a) * tipRadius;
            vertex(tx, ty);
        }
        // Left edge (downwards)
        for (let i = 0; i < leftEdge.length; i++) {
            vertex(leftEdge[i][0], leftEdge[i][1]);
        }
        endShape(CLOSE);

        // Draw fade-out ellipse at tip
        let c = color(this.color);
        c.setAlpha(10); // adjust alpha for fade
        fill(c);
        noStroke();

    }
}




