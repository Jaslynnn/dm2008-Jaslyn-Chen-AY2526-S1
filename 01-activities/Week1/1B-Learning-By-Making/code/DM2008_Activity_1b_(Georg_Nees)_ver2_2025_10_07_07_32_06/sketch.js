// DM2008
// Activity 1b (Georg Nees)
// make some of the shapes turn completely black

let x;
let y;
let w;


function setup() {
  createCanvas(800, 800)
  background(240);
 
}

function draw() {
  
  x = random(width);
  y = random(height);
  w = random(10, 80);
  
  


  
  // background(240,40);
     if(w+frameCount< width  && y < height ){

 
  strokeWeight(random(0.3, 2));
    stroke(random(255),random(255),255)
       noFill();
  shape1 = ellipse(x, y, w +frameCount - random(x) * 0.1, w *0.01* y);
  ChangeColor();

    
  }
  else{
    frameCount=0;
    
  }
  

}

function keyPressed() {
    saveCanvas("activity1b-image", "jpg");
}

function ChangeColor() {
  if (mouseX < width && mouseY < height) {
  
    stroke(255,random(255),255);
   
    circle(mouseX, mouseY, x*0.08);
  }
}