class photon {
    constructor(pos, dir, col="#00ffff") {
        this.pos = pos;
        this.old = pos;
        this.col = col;

        this.dir = dir;
        this.c = 8;
        this.radius = 1;
        this.countr = 0;
        this.countl = 0;
        this.countmin = 5;

        this.visible = true;
        this.oneHit = false;
        this.orbit = false;

        this.vel = p5.Vector.mult(this.dir, this.c);
    }

    update(a) {
        let w;
        let h;
        if (a) {
            w = a.width;
            h = a.height;
        }
        else {
            w = width;
            h = height;
        }
        ++this.countr;
        ++this.countl;

        // left
        if (this.pos.x < this.radius) {
            this.pos.x = this.radius;
            this.vel.x *= -1;
            this.visible = !(this.visible || this.oneHit);
        } else
        // right
        if (this.pos.x > w-this.radius) {
            this.pos.x = w-this.radius;
            this.vel.x *= -1;
            this.visible = !(this.visible || this.oneHit);
        }
        // top
        if (this.pos.y < this.radius) {
            this.pos.y = this.radius;
            this.vel.y *= -1;
            this.visible = !(this.visible || this.oneHit);
        } else
        // bottom
        if (this.pos.y > h-this.radius) {
            this.pos.y = h-this.radius;
            this.vel.y *= -1;
            this.visible = !(this.visible || this.oneHit);
        }

        let rnd = random(1);

        if (this.orbit) {
            let t = createVector(this.focus.x, this.focus.y, this.focus.z);
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

        if (a) {
            a.stroke(this.col);
            a.strokeWeight(this.radius * 2);
            a.fill(this.col);
            a.line(this.old.x, this.old.y, this.pos.x, this.pos.y);

            a.noStroke();
            a.ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
        }
        else {
            stroke(this.col);
            strokeWeight(this.radius * 2);
            fill(this.col);
            line(this.old.x, this.old.y, this.pos.x, this.pos.y);

            noStroke();
            ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
        }
    }

    setSpeed(speed) {
        this.c = speed;
        this.vel = p5.Vector.mult(this.dir, this.c);
    }
}

class circuit {
    constructor(n=30) {
        this.n = n;
        this.fade_speed = 15;
        this.p = [];
        this.guide = createVector(mouseX, mouseY);

        fill(0);
        rect(0, 0, width, height);

        for (let i = 0; i < this.n; ++i) {
            let dir = createVector(1, 0);
            dir.rotate(i * Math.PI/4);

            let t = new photon(createVector(width/2, height/2), dir);
            t.focus = this.guide;

            this.p.push(t);
        }
    }

    draw(a) {
        if (a) {
            a.fill(0, this.fade_speed);
            a.rect(0, 0, width, height);
        }
        else {
            fill(0, this.fade_speed);
            rect(0, 0, width, height);
        }

        for (let i =0; i < this.n; ++i) {
            let t = this.p[i];
            t.draw(a);
            t.update(a);
        }

        this.guide.x = mouseX;
        this.guide.y = mouseY;
    }

    pulse(x, y) {
        fill(0);
        rect(0, 0, width, height);

        for (let i = 0; i < this.n; ++i) {
            let dir = createVector(1, 0);
            dir.rotate(i * Math.PI/4);

            let t = this.p[i];
            t.visible = true;
            t.pos.x = x;
            t.pos.y = y;
            t.old.x = x;
            t.old.y = y;
            dir.mult(t.c);
            t.vel = dir;
            t.countr = 0;
            t.countl = 0;

        }

    }

    setSpeed(speed) {
        for (let i = 0; i < this.n; ++i) {
            let t = this.p[i];
            t.setSpeed(speed);
        }
    }

    setFadeSpeed(fade_speed) {
        if (fade_speed > 255 || fade_speed < 0) {
            throw new Error("Invalid fade speed " + fade_speed);
        }
        this.fade_speed = fade_speed;
    }

    mouseClicked() {
        this.pulse(mouseX, mouseY);
    }

    keyPressed(key) {
        switch(key) {
            case 'h': case 'H':
                for (let i = 0; i < this.n; ++i) {
                    this.p[i].oneHit = !this.p[i].oneHit;
                }
                break;
            case 'o': case 'O':
                for (let i =0; i < this.n; ++i) {
                    this.p[i].orbit = !this.p[i].orbit;
                }
                break;
        }
    }
}