let port; // Serial Communication port
let connectBtn;

let sensorVal;
let circleSize = 50;
let targetSize = 50; // used for Option 2
let balls = [];
let colors = ["#B26EF0", "#8A3FFC", "#E056FD"];
function setup() {
  createCanvas(windowWidth, windowHeight);
  port = createSerial(); // creates the Serial Port

  // Connection helpers
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(20, 20);
  connectBtn.mousePressed(connectBtnClick);
    for (let i = 0; i < colors.length; i++) {
        let x = random(width);
        let y = random(height);
        balls.push(new Ball(colors[i],x,y));
        balls.push(new Ball(colors[i],x,y));
        balls.push(new Ball(colors[i],x,y));
        balls.push(new Ball(colors[i],x,y));


    }

}

function draw() {
  background(240);
  // ellipse(width / 2, height / 2, circleSize);
// Step 2: update and display each ball
    for (let i = 0; i < balls.length; i++) {
        let b = balls[i];
        b.move();
        b.show();
        b.checkCollision(balls);

        // Step 3: check collisions
        // Use dist() between ball centers
        // Trigger feedback (color, bounce, etc.)
    }
  // Receive data from Arduino
  if (port.opened()) {
    sensorVal = port.readUntil("\n");
    // Only log data that has information, not empty signals
    if (sensorVal[0]) {
      // Once you verify data is coming in,
      // disable logging to improve performance
      // console.log(sensorVal);

      // OPTION 1:
      // Update circle's size with sensor's data directly
      // Reduce delay() value in Ardiuno to get smoother changes

      // use float() to convert from data from string to number
      // circleSize = float(sensorVal);

      // OPTION 2:
      // Update circle's size using lerp() to smoothly change values
      // This method even works with longer delay() values in Arduino

      targetSize = float(sensorVal);


      // last value in lerp() controls speed of change
      circleSize = lerp(circleSize, norm(targetSize,0,3), 0.1);
    }
  }
}
class Ball {
    constructor(color, x, y) {
        this.pos = createVector(x, y);
        this.col = color;
        this.r = random(10, 30);
        this.vel = createVector(random(-2, 2), random(-2, 2));
    }

    move() {
        this.pos.add(this.vel);

        if (this.pos.x - this.r < 0 || this.pos.x + this.r > width) {
            this.vel.x *= -1;

        }
        if (this.pos.y - this.r < 0 || this.pos.y + this.r > height) {
            this.vel.y *= -1;
        }

        // TODO: wrap around OR bounce off edges
    }

    show() {
        fill(this.col);
        noStroke();
        ellipse(this.pos.x, this.pos.y- random(sensorVal*0.5), circleSize);
        ellipse(this.pos.x - mouseX*0.1, this.pos.y - random(mouseY*0.1), circleSize);
        ellipse(this.pos.x + mouseX*0.3, this.pos.y + random(mouseY*0.3), circleSize);


    }

    checkCollision(others) {
        for (let i = 0; i < others.length; i++) {
            // Make sure we do not compare the ball to itself
            if (others[i] !== this) {
                let other = others[i];
                let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
                if (d < this.r + other.r) {
                    this.pos.add(this.vel);
                    if (this.col != other.col) {
                        this.col = other.col;
                        this.r += other.r * 0.001
                    }
                    ;


                    push();
                    stroke(this.col);
                    strokeWeight(4);
                    noFill();
                    ellipse(this.pos.x, this.pos.y, this.r * 2); // highlight on collision
                    pop();
                }
            }
        }
    }
}

// DO NOT REMOVE THIS FUNCTION
function connectBtnClick(e) {
  // If port is not already open, open on click,
  // otherwise close the port
  if (!port.opened()) {
    port.open(9600); // opens port with Baud Rate of 9600
    e.target.innerHTML = "Disconnect Arduino";
    e.target.classList.add("connected");
  } else {
    port.close();
    e.target.innerHTML = "Connect to Arduino";
    e.target.classList.remove("connected");
  }
}
