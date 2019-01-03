
function setup() {
    canvas = createCanvas(1066, 600);
    c = new circuit(100);
    c.setSpeed(1);

}

function draw() {
    //background(200);
    //rotateX(frameCount * 0.01);
    //rotateY(frameCount * 0.01);
    //box(250);
    c.draw();
}

function mouseClicked() {
    c.mouseClicked();
}

function keyPressed() {
    c.keyPressed(key)
    c.setSpeed(8);
}
