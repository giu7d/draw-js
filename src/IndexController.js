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
        this.display = new Display();
        this.setting = {
            lineType: 'std',
            circleRadius: 10
        }
        
        // HML Elements
        this.canvasElement = document.getElementById('canvas');
        this.ctx = this.canvasElement.getContext('2d');

        this.mouseDisplayElement = document.getElementById('mouseCoordinatesDisplay');        
    }   

    // Handlers
    mouseCoordinateHandler(event) {

        const position = utils.getMousePosition(this.canvasElement, event);

        const x = utils.xViewportToWorld(position.x, this.world, this.viewport);
        const y = utils.yViewportToWorld(position.y, this.world, this.viewport);

        this.mouseDisplayElement.innerHTML = `X: ${x} Y:${y}`;
    }

    makeLineHandler() {
        
        const poligon = new Poligon(idIterator++, this.setting.lineType);
        const eventHandler = (e) => utils.makeDrawEvent(e, eventHandler, poligon, this.canvasElement, this.ctx, this.world, this.viewport);
        
        this.canvasElement.addEventListener('click', eventHandler, false);
            
    }

    makeCircleHandler() {

        const poligon = new Poligon(idIterator++, this.setting.lineType, [], this.setting.circleRadius);
        const eventHandler = (e) => utils.makeDrawEvent(e, eventHandler, poligon, this.canvasElement, this.ctx, this.world, this.viewport);
        
        utils.toggleSettings();

        this.canvasElement.addEventListener('click', eventHandler, false);
    }

    

    // Settings
    setup() {
        
        console.log('Hi');

        this.display.poligons.push(
            new Poligon(idIterator++, this.setting.lineType, [
                new Point(0, this.world.yMax),
                new Point(0, this.world.yMin)
            ])
        );

        this.display.poligons.push(
            new Poligon(idIterator++, this.setting.lineType, [
                new Point(this.world.xMin, 0),
                new Point(this.world.xMax, 0)
            ])
        );

        this.display.draw(this.ctx, this.world, this.viewport);
    }

    setLineType(type) {
        this.setting.lineType = type;
    }


    setCircleRadius(size) {
        this.setting.circleRadius = size;
    }

}

