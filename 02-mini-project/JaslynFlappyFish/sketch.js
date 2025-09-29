// DM2008 — Mini Project
// FLAPPY BIRD (Starter Scaffold)

// Notes for students:
// 1) Add flap control in handleInput() (space / ↑ to jump)
// 2) Detect collisions between the bird and pipes → game over
// 3) Add scoring when you pass a pipe
// 4) (Stretch) Add start/pause/game-over states

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

let spawnCounter = 0; // simple timer
const SPAWN_RATE = 90; // ~ every 90 frames at 60fps ≈ 1.5s
const PIPE_SPEED = 2.5;
const PIPE_GAP = 200; // gap height (try 100–160)
const PIPE_W = 60;

//Take variable currentGameState to change between BeforeGame, GameStart, GameOver
let currentGameState = 0;
let score = 0;

/* ----------------- Setup & Draw ----------------- */
function setup() {
    createCanvas(480, 640);
    noStroke();
    textFont(font);
    textSize(30);
    textAlign(CENTER, CENTER);
    bird = new Bird(width / 2, height / 2);
    pipes = [new Pipe(width)];

    // Start with one pipe so there’s something to see
}

function draw() {
    background(18, 22, 28);
    // 2) update world
    bird.update();

    switch (currentGameState) {
        case 0:
            //BeforeGame
            fill(240);
            textSize(18);
            text("Press space to start", width / 2, (height / 4) * 3);
            textSize(40);
            text("Flappy Fish", width / 2, height / 5);


            break;
        case 1:
            //GameStart
            spawnCounter++;
            if (spawnCounter >= SPAWN_RATE) {
                pipes.push(new Pipe(width + 40));
                spawnCounter = 0;
            }
            // update + draw pipes
            for (let i = pipes.length - 1; i >= 0; i--) {
                pipes[i].update();
                pipes[i].show();
                pipes[i].hits(bird);

                if (pipes[i].offscreen()) {
                    pipes.splice(i, 1);
                }
            }
            push();
            strokeWeight(2);
            stroke(0);
            text(score, width / 2, height / 8);
            pop();
            break;

        case 2:
            //GameOver
            rectMode(CENTER);
            fill(240);
            textSize(50);
            text(score, width / 2, height / 3);




            break;
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
        } else if (currentGameState === 1) {
            bird.flap();
        } else if (currentGameState === 2) {
            score = 0;
            pipes = [];
            spawnCounter = 0;
            bird = new Bird(width / 2, height / 2);
            currentGameState = 0;
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
    }

    applyForce(fy) {
        this.acc.y += fy;
    }

    flap() {
        // instant upward kick
        this.vel.y = this.flapStrength;
        push();
        translate(this.pos.x - 10, this.pos.y);
        rotate(QUARTER_PI / 2);
        pop();
    }

    update() {
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
            // TODO (students): treat touching the ground as game over
        }
    }

    show() {
        //MainBody
        fill(255, 205, 80);
        ellipse(
            this.pos.x,
            this.pos.y,
            this.r * 2 + this.vel.x,
            this.r * 2 + this.vel.y / 2
        );

        push();

        translate(this.pos.x - 17, this.pos.y);
        rotate(-5);
        ellipse(0, 0, this.r * 0.9 + this.vel.x, this.r * 0.6 + this.vel.y / 2);
        pop();

        push();

        translate(this.pos.x - 17, this.pos.y + 7);
        rotate(5);
        ellipse(0, 0, this.r * 0.9 + this.vel.x, this.r * 0.6 + this.vel.y / 2);
        pop();

        fill(240);
        circle(
            this.pos.x + 5 + this.vel.x,
            this.pos.y - 4 - (this.vel.y / 3) * 2,
            10
        );
        //small eye
        fill(0);

        if (currentGameState == 0) {
            circle(
                this.pos.x + 7 + mouseX / this.pos.x,
                this.pos.y - 4 + mouseY / this.pos.y,
                4
            );
        } else {
            circle(this.pos.x + 7, this.pos.y - 4, 4);
        }

        // (Optional) add a small eye
        fill(255, 105, 80);
        ellipse(
            this.pos.x - 5 + this.vel.x,
            this.pos.y + 4 - (this.vel.y / 3) * 2,
            15,
            10 + this.vel.y / 5
        );
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

        this.top = gapY; // bottom of top pipe
        this.bottom = gapY + PIPE_GAP; // top of bottom pipe

        this.passed = false; // for scoring once per pipe
    }

    update() {
        this.x -= this.speed;
    }

    // javascript
    show() {
        if (currentGameState == 1) {
            fill(120, 200, 160);
            ellipse(this.x + this.w / 2, this.top, this.w, 20); // top pipe
            rectMode(CORNER); // Ensure CORNER mode
            rect(this.x, 0, this.w, this.top);
            ellipse(this.x + this.w / 2, this.top, this.w, 20); // top pipe
            rect(this.x, this.bottom, this.w, height - this.bottom);
            fill(50, 200, 200);
            ellipse(this.x + this.w / 2, this.bottom, this.w, 20); // bottom pipe
        }
    }


    offscreen() {
        // look at MDN to understand what 'return' does
        // we will learn more about this in Week 6
        return this.x + this.w < 0;
    }

    // TODO (students): circle-rect collision (simple)
    // 1) Check if bird within pipe's x range.
    // 2) If yes, check if bird.y is outside the gap (above top OR below bottom).
    //    Then it’s a hit.
    //
    hits(bird) {
        const withinX =
            bird.pos.x + bird.r > this.x && bird.pos.x - bird.r < this.x + this.w;
        const aboveGap = bird.pos.y - bird.r < this.top;

        const belowGap = bird.pos.y + bird.r > this.bottom;
        //Top ellipse
        let d = dist(this.x + this.w / 2, this.bottom, bird.pos.x, bird.pos.y);

        if (withinX) {
            if (aboveGap) {
                bird.vel.y += 1;
                this.speed = 0;

                // currentGameState = 2;
            }
            if (belowGap) {
                bird.vel.y += 1;

                this.speed = 0;

                currentGameState = 2;
            }

            if (d < this.w / 2 + bird.r) {
                console.log("HitPoleTop");
                bird.vel.y += 1;

                this.speed = 0;

                currentGameState = 2;
            }

            if (this.x == bird.pos.x) {
                score += 1;
                console.log(score);
            }
        }

        return withinX && score && (aboveGap || belowGap);
    }
}
