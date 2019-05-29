export class Poligon {

    constructor(type, points = [], radius = 0) {
        this.type = type;
        this.points = [...points];
        this.radius = radius
    }

    
    // 
    // PLOT
    // 
    
    plot(canvas, world, viewport) {
        (this.radius === 0) ? this.plotLine(canvas, world, viewport) : this.plotCircle(canvas, world, viewport);
    }

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

    plotCircle(canvas, world, viewport) {
        switch (this.type) {
            default:                
                this.points.map(point => {
                    const xViewport = point.xWorldToViewport(world, viewport);
                    const yViewport = point.yWorldToViewport(world, viewport);    
                    this._bresenhamCircle(xViewport, yViewport, this.radius, canvas); 
                });
                break;
        }
    }


    // 
    // TOOLS
    // 
    
    translate(x, y) {        
        this.points.map(point => point.translate(x,y));
    }

    rotate(theta) {
        this.points.map(point => point.rotate(theta));
    }

    rotateSelfCenter(theta) {
        
        let xAux = 0; 
        let yAux = 0;
        
        this.points.map(point => {
            xAux += point.x;
            yAux += point.y;
        });

        const xCenter = xAux / this.points.length;
        const yCenter = yAux / this.points.length;

        this.points.map(point => point.rotateSelfCenter(xCenter, yCenter, theta));

    }

    scale(rate) {
        
        this.points.map(point => point.scale(rate, rate));

        if (this.radius != 0) {
            this.radius *= rate;
        }
    }

    reflect(xAxis, yAxis) {
        this.points.map(point => point.reflect(xAxis, yAxis));
    }

    getEuclidianDist(x0, y0, x1, y1) {
        return ((x1-x0)*(x1-x0))/((y1-y0)*(y1-y0));
    }

    matrixMultiply(matrix0 = [[]], matrix1 = [[]]) {
        
        let resultMatrix;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                resultMatrix[i][j] = (matrix0[i][0] * matrix1[0][j]) + (matrix0[i][1] * matrix1[1][j]) + (matrix0[i][2] * matrix1[2][j]);
            }
        }

        return resultMatrix;
    }
    

    // 
    // ALGORITHMS
    // 

    // LINE
    _stdLine(canvas, world, viewport) {

        canvas.beginPath();
        
        this.points.map((point,i) => {
            const xViewport = point.xWorldToViewport(world, viewport);
            const yViewport = point.yWorldToViewport(world, viewport);

            (i == 0) ? canvas.moveTo(xViewport, yViewport) : canvas.lineTo(xViewport, yViewport);
        });
        
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
    
    // CIRCLE
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
    

    // CURVES
    // 
    

}