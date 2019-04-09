export class Poligon {


    constructor(id, type, points = []) {
        this.id = id;
        this.type = type;
        this.points = [...points];
    }
    

    draw(canvas, world, viewport) {
        this._lineTo(canvas, world, viewport);
    }

    _lineTo(canvas, world, viewport) {

        let xViewport, yViewport;

        console.log('hi');

        canvas.beginPath();
        
        for (let i = 0; i < this.points.length; i++) {

            console.log(i);

            xViewport = this.points[i].xWorldToViewport(world, viewport);
            yViewport = this.points[i].yWorldToViewport(world, viewport);

            console.log(xViewport + ' ' + yViewport);

            (i == 0) ? canvas.moveTo(xViewport, yViewport): canvas.lineTo(xViewport, yViewport);
        }

        canvas.stroke();
    }
    
    // _bresenham()
    // _dda()

}