// DDM2008
// Activity 1a

// Run the sketch, then click on the preview to enable keyboard
// Use the 'Option' ('Alt' on Windows) key to view or hide the grid
// Use the 'Shift' key to change overlays between black & white
// Write the code for your creature in the space provided

function setup() {
  createCanvas(400, 400);
}

function draw() {
  
  background(240);
//   Head
  fill( 10,10,10 );
  rect(150, 150 , 60 , 30 , 20);
//   Neck
  rect(180, 150 , 30 , 60 , 20 , 2);
  rect(180, 190 , 80 , 30 , 20);
  
  rect(180, 190 , 20 , 60 , 10, 3);
  rect(240, 190 , 20 , 60 , 10, 3);
  
   // rect(166, 140 , 5 , 35 , 50 );
  
  rect(195, 140 , 15 , 20 , 10 ,3);
  
    fill( 255,255,255 );
  ellipse(190, 160 , 10 , 10 , 20);
 
  // YOUR CODE HERE
  
  // YOUR CODE HERE
  
  helperGrid(); // do not edit or remove this line
}
