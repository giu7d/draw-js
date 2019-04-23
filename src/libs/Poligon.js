export class Poligon {


    constructor(id, type, points = [], radius = 0) {
        this.id = id;
        this.type = type;
        this.points = [...points];
        this.radius = radius
    }

    // Plot Lines or Circles
    draw(canvas, world, viewport) {
        if (this.radius === 0) {
            this.plotLine(canvas, world, viewport);
        } else {
            this.plotCircle(canvas, world, viewport);
        }
    }

    // Plot Lines w/ Poligon.type selected algorithm;
    plotLine(canvas, world, viewport) {
        switch (this.type) {
            case 'std':
                this._stdLine(canvas, world, viewport);
                break;
            case 'dda':
                this._ddaLine(canvas, world, viewport);
                break;
            case 'bre':
                this._bresenhamLine(canvas, world, viewport);
                break;
            default:
                console.log('Hello');
                break;
        }
    }

    // Plot Circle w/ Poligon.type selected algorithm;  
    plotCircle(canvas, world, viewport) {
        switch (this.type) {
            default:                
                let xViewport, yViewport;
                
                for (let i = 0; i < this.points.length; i++) {

                    xViewport = this.points[i].xWorldToViewport(world, viewport);
                    yViewport = this.points[i].yWorldToViewport(world, viewport);

                    this._bresenhamCircle(xViewport, yViewport, this.radius, canvas);
                }
                break;
        }
    }

    
    // RENDER LINE IMPL & ALGORITHMS

    // Name:
    //      _stdLine(canvas, world, viewport)
    //      _ddaLine(canvas, world, viewport)
    //      _bresenhamLine(canvas, world, viewport)
    // Task:
    //      Draw lines with Standart JS, DDA and Bresenham
    _stdLine(canvas, world, viewport) {

        let xViewport, yViewport;

        canvas.beginPath();
        
        for (let i = 0; i < this.points.length; i++) {

            xViewport = this.points[i].xWorldToViewport(world, viewport);
            yViewport = this.points[i].yWorldToViewport(world, viewport);

            (i == 0) ? canvas.moveTo(xViewport, yViewport): canvas.lineTo(xViewport, yViewport);
        }

        canvas.stroke();
    }

    _ddaLine(canvas, world, viewport) {

        let xViewport, yViewport, xViewportNext, yViewportNext;
        
        for (let i = 0; i < (this.points.length-1); i++) {

            xViewport = this.points[i].xWorldToViewport(world, viewport);
            yViewport = this.points[i].yWorldToViewport(world, viewport);

            xViewportNext = this.points[i+1].xWorldToViewport(world, viewport);
            yViewportNext = this.points[i+1].yWorldToViewport(world, viewport);

            this._dda(xViewport,yViewport,xViewportNext, yViewportNext, canvas);
        }
    }

    _bresenhamLine(canvas, world, viewport) { 

        let xViewport, yViewport, xViewportNext, yViewportNext;
        
        for (let i = 0; i < (this.points.length-1); i++) {

            xViewport = this.points[i].xWorldToViewport(world, viewport);
            yViewport = this.points[i].yWorldToViewport(world, viewport);

            xViewportNext = this.points[i+1].xWorldToViewport(world, viewport);
            yViewportNext = this.points[i+1].yWorldToViewport(world, viewport);

            this._bresenham(xViewport,yViewport,xViewportNext, yViewportNext, canvas);
        }
    }

    // Name:
    //      _dda(canvas, world, viewport)
    //      _bresenham(canvas, world, viewport)
    // Task:
    //      DDA and Bresenham algorithms
    _dda(xStart, yStart, xEnd, yEnd, canvas) {

        // Calculate Delta X & Y

        const deltaX = (xEnd - xStart);
        const deltaY = (yEnd - yStart);

        // Calculate steps
        const steps = (Math.abs(deltaX) > Math.abs(deltaY)) ? Math.abs(deltaX) : Math.abs(deltaY);        
        const incX = deltaX / parseFloat(steps);
        const incY = deltaY / parseFloat(steps);
        
        // Add pixel each step
        let x = xStart;
        let y = yStart;

        canvas.fillStyle = "rgba(255,0,0,1)";

        for (let i = 0; i <= steps; i++) {
            canvas.fillRect(x,y,1,1);
            x += incX;
            y += incY;
        }

    }

    _bresenham(xStart, yStart, xEnd, yEnd, canvas) {
        
        const deltaX = Math.abs(xEnd - xStart);
        const deltaY = Math.abs(yEnd - yStart);
        
        const spareX = (xStart < xEnd) ? 1 : -1;
        const spareY = (yStart < yEnd) ? 1 : -1;
        
        let err = deltaX - deltaY;

        canvas.fillStyle = "rgba(0,0,255,1)";

        while(true) {
                        
            canvas.fillRect(xStart, yStart, 1, 1);            
            
            if ((xStart === xEnd) && (yStart === yEnd)) {
                break;    
            }
            
            if (Math.abs(xStart - xEnd) < 0.0001 && Math.abs(yStart - yEnd) < 0.0001) {
                break;
            }

            let e2 = 2 * err;
            
            if (e2 > -deltaY) {
                err -= deltaY;
                xStart += spareX;
            } 
            
            if (e2 < deltaX) {
                err += deltaX;
                yStart += spareY;    
            }
        
        }
    }
    
    // RENDER CIRCLE IMPL & ALGORITHMS

    // Name:
    //      _bresenhamCircle(canvas, world, viewport)
    // Task:
    //      Desenha circulo com o algoritmo de bresenham;
    _bresenhamCircle(x, y, radius, canvas) {
        
        let spareX = -radius;
        let spareY = 0;
        let err = 2-2*radius;

        canvas.fillStyle = "rgba(255,0,0,1)";

        do {
            
            canvas.fillRect(x-spareX, y+spareY, 3, 3);
            canvas.fillRect(x-spareY, y-spareX, 3, 3);
            canvas.fillRect(x+spareX, y-spareY, 3, 3);
            canvas.fillRect(x+spareY, y+spareX, 3, 3);

            radius = err;

            if (radius <= spareY) {
                err += ++spareY*2+1;
            }

            if ((radius > spareX) || (err > spareY)) {
                err += ++spareX*2+1;
            }

        } 
        while (spareX < 0);
    }


    // Clipping

    // clipping(clip, world, viewport) {
        
    //     let p1, p2, out;

    //     poli = new Poligon(0, 'std');

    //     for(let i = 0; i < this.points.length -1; i++) {
            
    //         p1 = this.points[i].regionCode(clip, world, viewport);
    //         p2 = this.points[i+1].regionCode(clip,world,viewport);

    //         if ((p1 === 0) && (p2 === 0)) {
    //             poli.points.push(this.points[i]);
    //             poli.points.push(this.points[i+1]);
    //         } else if ((p1 & p2) == 0) {
                
    //             let m = (this.points[i+1].y - this.points[i].y)/(this.points[i+1].x - this.points[i].x);
    //             let xAux, yAux;

    //             if (p1 != 0 && p2 == 0) {
    //                 out = p1;
    //                 poli.points.push(this.points[i+1]);
    //                 // poli.points.push(calculateNewPoint);
    //             } else if (p1 == 0 && p2 != 0) {
    //                 out = p2;
    //                 poli.points.push(this.points[i]);
    //                 // poli.points.push(calculateNewPoint);
    //             } else {
    //                 out = p2;
    //                 // poli.points.push(calculateNewPoint);
    //                 // poli.points.push(calculateNewPoint);
    //             }
    //         }
    //     }

    //     return poli;
    // }


    // _calculateNewPoint()

}