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
        this.reflection = false;

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
            this.visible = !((this.visible && !this.reflection) || this.oneHit);
        } else
        // right
        if (this.pos.x > w-this.radius) {
            this.pos.x = w-this.radius;
            this.vel.x *= -1;
            this.visible = !((this.visible && !this.reflection) || this.oneHit);
        }
        // top
        if (this.pos.y < this.radius) {
            this.pos.y = this.radius;
            this.vel.y *= -1;
            this.visible = !((this.visible && !this.reflection) || this.oneHit);
        } else
        // bottom
        if (this.pos.y > h-this.radius) {
            this.pos.y = h-this.radius;
            this.vel.y *= -1;
            this.visible = !((this.visible && !this.reflection) || this.oneHit);
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
    constructor(photon_number=30) {
        if (photon_number < 1) {
            throw new Error("Invalid photon number " + photon_number);
        }
        this.photon_number = photon_number;
        this.background_RGB = [0, 0, 0];
        this.fade_speed = 15;
        this.photon_list = [];
        this.guide = createVector(mouseX, mouseY);
        this.reset_background = true;

        for (let i = 0; i < this.photon_number; ++i) {
            let dir = createVector(1, 0);
            dir.rotate(i * Math.PI/4);

            let t = new photon(createVector(width/2, height/2), dir);
            t.focus = this.guide;

            this.photon_list.push(t);
        }
    }

    draw(a, update_photon_position=true) {
        let background_RGBA = this.background_RGB.slice(0);
        if (!this.reset_background) {
            background_RGBA.push(this.fade_speed);
        }
        else {
            this.reset_background = false;
        }

        console.log(background_RGBA);

        if (a) {
            a.fill(background_RGBA);
            a.rect(0, 0, a.width, a.height);
        }
        else {
            fill(background_RGBA);
            rect(0, 0, width, height);
        }

        for (let i =0; i < this.photon_number; ++i) {
            let t = this.photon_list[i];
            t.draw(a);
            if (update_photon_position) {
                t.update(a);
            }
        }

        this.guide.x = mouseX;
        this.guide.y = mouseY;
    }

    pulse(x, y) {
        this.reset_background = true;

        for (let i = 0; i < this.photon_number; ++i) {
            let dir = createVector(1, 0);
            dir.rotate(i * Math.PI/4);

            let t = this.photon_list[i];
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
        for (let i = 0; i < this.photon_number; ++i) {
            let t = this.photon_list[i];
            t.setSpeed(speed);
        }
    }

    setFadeSpeed(fade_speed) {
        if (fade_speed > 255 || fade_speed < 0) {
            throw new Error("Invalid fade speed " + fade_speed);
        }
        this.fade_speed = fade_speed;
    }

    setBackgroundColour(Background_RGB, reset_background=true) {
        this.background_RGB = Background_RGB;
        this.reset_background = reset_background;
    }

    setPhotonOrbit(photons_orbit_mouse) {
        for (let i =0; i < this.photon_number; ++i) {
            this.photon_list[i].orbit = photons_orbit_mouse;
        }
    }

    getPhotonOrbit() {
        return this.photon_list[0].orbit;
    }

    setPhotonOneHit(photon_one_hit) {
        for (let i =0; i < this.photon_number; ++i) {
            this.photon_list[i].oneHit = photon_one_hit;
        }
    }

    getPhotonOneHit() {
        return this.photon_list[0].oneHit;
    }

    setPhotonReflection(photon_reflection) {
        for (let i =0; i < this.photon_number; ++i) {
            this.photon_list[i].reflection = photon_reflection;
        }
    }

    getPhotonReflection() {
        return this.photon_list[0].reflection;
    }
}