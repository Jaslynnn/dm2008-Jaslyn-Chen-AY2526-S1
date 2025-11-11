// DM2008
// Activity 1b (Ryoji Ikeda)
// New name: Data Prison epileptic 

let x;
let w;

function setup() {
  createCanvas(800, 800);
  background(255);
  noStroke();
  fill(0);
}

function draw() {
  background(255, 10);
  
  x = random(width);
  w = random(1, height+ frameCount*0.01);
  rect(x, 0, w, height/2);
  
  x = random(width);
  rect(x, width/2, w, height+ frameCount*0.01);
  ChangeColor();
}

function keyPressed() {
  saveCanvas("activity1b-image", "jpg");
}

function ChangeColor() {
  if (mouseX < width && mouseY < height) {
  
    stroke(random(255),random(255),255);
    noFill();  
    strokeWeight(random(10, 40));
   
    rect(mouseX, mouseY, x*0.08);
 
  }
}