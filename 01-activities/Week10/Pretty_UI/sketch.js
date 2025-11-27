let colorBtn, sizeSlider, shapeSelect;
let shapeColor;
let rainDrops = []

//rainMaster
//Control the intensity of the rain
//the color of the rain

function setup() {
  createCanvas(640, 400);
  // noStroke();





  // starting color
  shapeColor = color(random(255), random(255), random(255));

  // Button: change color
  colorBtn = createButton("Change Color");
  colorBtn.position(35, 35);
  colorBtn.mousePressed(randomShapeColor);
  fill(0);

  text("RainMaster", 100, 55);

  function startRain(){
      //causes the width of
      ellipse(width/2 ,height/2 ,20 )

  }



  function randomShapeColor() {
    shapeColor = color(random(255), random(255), random(255));
  }

  // Slider: controls size
  createP("Size").position(0, 50).style("margin", "4px 0 0 16px");
  sizeSlider = createSlider(1, 25, 2, 1);
  sizeSlider.position(15, 70);

  // Dropdown: choose shape
  createP("Shape").position(0, 100).style("margin", "8px 0 0 16px");
  shapeSelect = createSelect();
  shapeSelect.position(16, 130);
  shapeSelect.option("ellipse");
  shapeSelect.option("rect");
  shapeSelect.option("triangle");
}

function draw() {

  // text("RainMaster", 35, 55);

  fill(shapeColor);
  push();
  translate(width * 0.65, height * 0.5);
  let s = sizeSlider.value();
  rainDrops.push(new rain(-width/4, height/s, 100, 10, s, 10));
    for (let i = 0; i < rainDrops.length; i++) {
        rainDrops[i].startRaining();

    }

  // draw chosen shape
  let choice = shapeSelect.value();
  if (choice === "ellipse") {
    ellipse(0, 0, s, s);
  } else if (choice === "rect") {
    rectMode(CENTER);
    rect(0, 0, s, s);
  } else if (choice === "triangle") {
    triangle(-s * 0.6, s * 0.5, 0, -s * 0.6, s * 0.6, s * 0.5);
  }
  pop();
}

class rain{
    constructor(x, y, c, s, n, ss, spd) {
        // This code runs once when an instance is created.
        this.x = x;
        this.y = y;
        this.c = c;
        this.s = s;
        this.n = n
        this.ss = ss;
        this.spd = spd;
    }
    startRaining(){
        //
        noStroke();
        for (let i = 0; i < 10; i++){
            let x = this.x/2*i*0.5
            let y = this.y/2/i
        for (let j = 0; j < this.n; j++){
            ellipse(x,y+j*this.n ,i*this.n/j )

        }
        }

    }
}
