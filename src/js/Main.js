// Nome:
//      main.js
// Objetivo:
//      Tudo que interage com o DOM deve ser feito neste arquivo de forma estruturada

import { Point } from './Point';
import { Poligon } from './Poligon';
import { Window } from './Window';
import { Display } from './Display';
import * as utils from './Utils';

// Canvas
const canvasElement = document.getElementById('canvas');
const ctx = canvasElement.getContext('2d');
const world = new Window(-250, 250, -250, 250);
const viewport = new Window(0, 500, 0, 500);

// Display's
const mouseDisplayElement = document.getElementById('mouseCoordinatesDisplay');


export function main() {
    
    const display = new Display();
    
        
    display.poligons.push(
        new Poligon(0, "eixo", [
            new Point(0, world.yMax),
            new Point(0, world.yMin)
        ])
    );

    display.poligons.push(
        new Poligon(1, "eixo", [
            new Point(world.xMin, 0),
            new Point(world.xMax, 0)
        ])
    );

    display.draw(ctx, world, viewport);
    
}

export function trackMouse(event) {

    const position = utils.getMousePosition(canvasElement, event);
    
    const x = utils.xViewportToWorld(position.x, world, viewport);
    const y = utils.yViewportToWorld(position.y, world, viewport);

    mouseDisplayElement.innerHTML = (x >= world.xMin && x <= world.xMax && y >= world.yMin && y <= world.yMax ) ? `X: ${x} Y:${y}` : 'X: 0.00 Y: 0.00';
}
