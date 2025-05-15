export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y; 
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    mult(k) {
        return new Vector(this.x * k, this.y * k);
    }

    abs() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    dir(v) {
        let d = v.sub(this);
        let mag = d.abs();
        if (mag === 0) return new Vector(0, 0); // Avoid division by zero
        return d.mult(1 / mag);
    }
}