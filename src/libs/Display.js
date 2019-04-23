export class Display {

    constructor(poligons = []) {
        this.poligons = poligons;
    }

    
    draw(canvas, world, viewport) {

        this._reset(canvas);
        
        this.poligons.map(poligon => {
            poligon.plot(canvas, world, viewport);
        })
    }

    _reset(canvas) {
        canvas.save();
        canvas.setTransform(1, 0, 0, 1, 0, 0);
        canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
        canvas.restore();
    }
}