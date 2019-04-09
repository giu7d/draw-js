import { Point } from './libs/Point';
import { Poligon } from './libs/Poligon';
import { Window } from './libs/Window';
import { Display } from './libs/Display';
import * as utils from './libs/Utils';

let idIterator = 0;

export class IndexController {

    constructor() {
        
        this.world = new Window(-250, 250, -250, 250);
        this.viewport = new Window(0, 500, 0, 500);
        
        // Canvas Elements
        this.canvasElement = document.getElementById('canvas');
        this.ctx = this.canvasElement.getContext('2d');
        
        // Display Elements
        this.display = new Display();
        this.mouseDisplayElement = document.getElementById('mouseCoordinatesDisplay');
    }   

    setup() {
        
        this.display.poligons.push(
            new Poligon(idIterator++, "eixo", [
                new Point(0, this.world.yMax),
                new Point(0, this.world.yMin)
            ])
        );

        this.display.poligons.push(
            new Poligon(idIterator++, "eixo", [
                new Point(this.world.xMin, 0),
                new Point(this.world.xMax, 0)
            ])
        );

        this.display.draw(this.ctx, this.world, this.viewport);
    }

    mouseCoordinateHandler(event) {

        const position = utils.getMousePosition(this.canvasElement, event);

        const x = utils.xViewportToWorld(position.x, this.world, this.viewport);
        const y = utils.yViewportToWorld(position.y, this.world, this.viewport);

        this.mouseDisplayElement.innerHTML = `X: ${x} Y:${y}`;
    }

    makeLineHandler() {
        
        const poligon = new Poligon(idIterator++, "poligon");        
        
        this.canvasElement.addEventListener('click', (event) => {

            if (!event.ctrlKey) { 
           
                const position = utils.getMousePosition(this.canvasElement, event);
                const x = utils.xViewportToWorld(position.x, this.world, this.viewport);
                const y = utils.yViewportToWorld(position.y, this.world, this.viewport);

                poligon.points.push(new Point(x, y));
                poligon.draw(this.ctx, this.world, this.viewport);                
           
            } else {


                // this.display.poligons.push(poligon);
                // this.display.draw(this.ctx, this.world, this.viewport);
                // this.canvasElement.removeEventListener('click', arguments.callee, false);
                // console.log('Exit')
            }

        });
            
    
    }


}