class photon {
    constructor (pos, dir) {
        this.c = 8;
        this.radius = 1;
        this.visible = true;
        this.countr = 0;
        this.countl = 0;
        this.countmin = 5;
        this.oneHit = false;
        this.orbit = false;
        this.pos = pos;
        this.old = pos;
        dir.mult(this.c);
        this.vel = dir;
    }

    update(a) {
        ++this.countr;
        ++this.countl;

        // left
        if (this.pos.x < this.radius) {
            this.pos.x = this.radius;
            this.vel.x *= -1;
            this.visible = !(this.visible | this.oneHit);
        } else
        // right
        if (this.pos.x > a.width-this.radius) {
            this.pos.x = a.width-this.radius;
            this.vel.x *= -1;
            this.visible = !(this.visible | this.oneHit);
        }
        // top
        if (this.pos.y < this.radius) {
            this.pos.y = this.radius;
            this.vel.y *= -1;
            this.visible = !(this.visible | this.oneHit);
        } else
        // bottom
        if (this.pos.y > a.height-this.radius) {
            this.pos.y = a.height-this.radius;
            this.vel.y *= -1;
            this.visible = !(this.visible | this.oneHit);
        }

        let rnd = a.random(1);
        //if (rnd > 0.996) visible = !visible;

        if (this.orbit) {
        let t = createVector(this.focus.x,this.focus.y,this.focus.z);
        t.sub(this.pos);
        t.normalize();
        let a0 = p5.Vector.dot(t,this.vel)/this.c;

        if (rnd < 0.04 && this.countl > this.countmin) {
            this.vel.rotate(-Math.PI/4);
            this.countl = 0;
        } else if (a0 < 0 && rnd < 0.6 && this.countr > this.countmin) {
            this.vel.rotate(Math.PI/4);
            this.countr = 0;
        }

        } else {
        if (rnd < 0.04 && this.countl > this.countmin) {
            this.vel.rotate(Math.PI/4);
            this.countl = 0;
        } else if (rnd < 0.08 && this.countr > this.countmin) {
            this.vel.rotate(-Math.PI/4);
            this.countr = 0;
        }
        }
        this.old = createVector(this.pos.x,this.pos.y,this.pos.z);
        this.pos.add(this.vel);
    }

    draw(a) {
        if (!this.visible) return;

        a.stroke(this.col);
        a.strokeWeight(this.radius*2);
        a.fill(this.col);
        a.line(this.old.x, this.old.y, this.pos.x, this.pos.y);

        a.noStroke();
        a.ellipse(this.pos.x, this.pos.y, this.radius*2, this.radius*2);
    }
}

const n = 30;
var p = [];
var guide;

function setup() {
    createCanvas(1066, 600);
//  createCanvas(windowWidth, windowHeight);
    //fullScreen();
    //noLoop();
    //surface.setResizable(true);
    //surface.setFrameRate(1);

    guide = new photon(createVector(random(width), random(height)), createVector(1,1));
    guide.col = "#ffffff";

    guide.vel.mult(1.5);
    guide.radius = 10;

    var i;
    for (i = 0; i < n; ++i) {
        //PVector dir = new PVector(random(1) < 0.5? 1 : -1, random(1) < 0.5? 1 : -1);
        var dir = createVector(1, 0);
        dir.rotate(i * Math.PI/4);
        //photon t = new photon(new PVector(random(width), random(height)), dir);
        var t = new photon(createVector(width/2, height/2), dir);
        t.col = "#00ffff";
        t.focus = createVector(width,height);
        t.radius = 1 + random(1);
        t.orbit = false;
        //  t.visible = 1 == (i & 1);
        t.focus = guide.pos;
        //t.vel.mult(0.5+random(1));
        p.push(t);
    }

    background(255);
}

function draw() {
    fill(0, 10);
    rect(0, 0, width, height);
    //PVector cent = new PVector(mouseX,mouseY);
    var i;
    for (i = 0; i < n; ++i) {
        var t = p[i];
        t.draw(this);
        t.update(this);
    }
    //guide.update(this);
    guide.pos.x = mouseX;
    guide.pos.y = mouseY;
    //guide.draw(this);
    //guide.visible = true;

    //saveFrame("frames/####.png");
//   if (frameCount % 100 == 0) {
//     for (int i = 0; i < n; ++i)
//       if (p.get(i).visible)
//         return;
//     pulse(width/2, height/2);
//   }
}

function pulse(x, y) {
    for (i = 0; i < n; ++i) {
        var dir = createVector(1, 0);
        dir.rotate(i * Math.PI/4);

        var t = p[i];
        t.visible = true;
        t.pos.x = x; t.pos.y = y;
        t.old.x = t.pos.x; t.old.y = t.pos.y;
        dir.mult(t.c);
        t.vel = dir;
        t.countr = t.countl = 0;
    }
}

function mouseClicked() {
    pulse(mouseX, mouseY);
}

function keyPressed() {
    switch(key) {
        case 'h': case 'H':
            for (i = 0; i < n; ++i) {
            p[i].oneHit = !p[i].oneHit;
        }
            break;
        case 'o': case 'O':
            for (i = 0; i < n; ++i) {
            p[i].orbit = !p[i].orbit;
        }
            break;
        case 'l':
            console.log(guide.pos.toString());
        }
}