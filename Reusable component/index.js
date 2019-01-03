
function setup() {
    canvas = createCanvas(1066, 600);
    c = new circuit(100);

}

function draw() {
    //background(200);
    //rotateX(frameCount * 0.01);
    //rotateY(frameCount * 0.01);
    //box(250);
    c.draw();
}

function mouseClicked() {
    c.pulse(mouseX, mouseY);
}

function keyPressed() {
    switch(key) {
        case 'h':
        case 'H':
            c.setPhotonOneHit(!c.getPhotonOneHit());
            break;
        case 'o':
        case 'O':
            c.setPhotonOrbit(!c.getPhotonOrbit());
            break;
        case 'r':
        case 'R':
            c.setPhotonReflection(!c.getPhotonReflection());
            break;
        case 't':
            c.setBackgroundColour([0, 255, 0]);
            break;
        case 'y':
            c.setBackgroundColour([0, 0, 0]);
    }
}

