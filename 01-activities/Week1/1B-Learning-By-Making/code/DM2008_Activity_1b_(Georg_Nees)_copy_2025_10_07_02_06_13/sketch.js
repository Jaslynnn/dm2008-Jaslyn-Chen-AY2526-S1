// DM2008
// Activity 1b (Georg Nees)
// make some of the shapes turn completely black

let x;
let y;
let w;


function setup() {
  createCanvas(800, 800)
  background(0);
 
}

function draw() {
  
  x = random(width);
  y = random(height);
  w = random(10, 80);
  frameRate(10);
  

  ChangeColor();
  
  // background(240,40);
     if(w+frameCount< width  && y < height ){

 
  strokeWeight(random(0.3, 2));
        noStroke();
       // stroke(random(255),random(255),255)
    fill(random(255),random(255),255)
       // noFill();
  shape1 = rect(x, y, w +frameCount - random(x) * 0.1, w *0.01* y, w *0.01* y);
 

    
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
  
   
   // noFill();
      stroke(random(255),random(255),255)
    rect(mouseX, mouseY, w +frameCount - random(x) * 0.01, w *0.01,x,y);
    // shape2 = ellipse(mouseX, mouseY, w +frameCount - random(x) * 0.1, w *0.01* y,width);
  }
}