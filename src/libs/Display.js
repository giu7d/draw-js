export class Display {

    constructor() {
        this.poligons = [];
    }

    draw(canvas, world, viewport) {

        this._reset(canvas);

        for(let i = 0; i < this.poligons.length; i++) {
            this.poligons[i].draw(canvas,world,viewport);
        }
    }


    _reset(canvas) {
        canvas.save();
        canvas.setTransform(1, 0, 0, 1, 0, 0);
        canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
        canvas.restore();
    }
}