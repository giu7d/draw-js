import { Point } from './libs/Point';
import { Poligon } from './libs/Poligon';
import { Window } from './libs/Window';
import { Display } from './libs/Display';
import { Mouse } from './libs/Mouse';


export class IndexController {

    constructor() {
        
        this.canvasElement = document.getElementById('canvas');
        this.ctx = this.canvasElement.getContext('2d');
        
        // Proprierties
        
        this.world = new Window(-250, 250, -250, 250);
        this.viewport = new Window(0, 500, 0, 500);
        this.display = new Display();
        this.mouse = new Mouse(this.canvasElement);
       
        this.settings = {
            lineType: 'std',
            circleRadius: 10,
            translateSpeed: 10,
            rotateCenter: false,
            rotationDegrees: 25,
            scaleRate: 1.2,
            clipHeight: 300,
            clipWidth: 300
        }
    }


    setup() {
        
        this.display.poligons.push(
            new Poligon(this.settings.lineType, [
                new Point(0, this.world.yMax),
                new Point(0, this.world.yMin)
            ])
        );

        this.display.poligons.push(
            new Poligon(this.settings.lineType, [
                new Point(this.world.xMin, 0),
                new Point(this.world.xMax, 0)
            ])
        );
        
        this.display.draw(this.ctx, this.world, this.viewport);
    }

    // 
    // Handlers
    // 
    
    displayCoordinateHandler(event) {
        const htmlElement = document.getElementById("mouseCoordinatesDisplay");
        const point = this.mouse.positionAsWorldPoint(event, this.world, this.viewport);
        
        htmlElement.innerHTML = `X: ${point.x} Y:${point.y}`;
    }

    // shapes
    
    makeLineHandler() {
        const poligon = new Poligon(this.settings.lineType);
        const index = this.display.poligons.push(poligon)-1;
        const eventHandler = (e) => this._renderEventInCanvas(e, eventHandler, index);
        
        this.canvasElement.addEventListener('click', eventHandler, false);
    }

    makeCircleHandler() {

        const poligon = new Poligon(this.settings.lineType, [], this.settings.circleRadius);
        const index = this.display.poligons.push(poligon)-1;
        const eventHandler = (e) => this._renderEventInCanvas(e, eventHandler, index);
        
        this.canvasElement.addEventListener('click', eventHandler, false);
    }

    // tools

    translateHandler() {
        
        const htmlElement = document.getElementById("translate");
        const eventHandler = (event) => {
            
            switch (event.key) {
                case 'ArrowUp':
                    this.display.poligons.map(poligon => {
                        poligon.translate(0, this.settings.translateSpeed);
                    });
                    break;

                case 'ArrowDown':
                    this.display.poligons.map(poligon => {
                        poligon.translate(0, -this.settings.translateSpeed);
                    });
                    break;

                case 'ArrowLeft':
                    this.display.poligons.map(poligon => {
                        poligon.translate(-this.settings.translateSpeed, 0);
                    });
                    break;

                case 'ArrowRight':
                    this.display.poligons.map(poligon => {
                        poligon.translate(this.settings.translateSpeed, 0);
                    });
                    break;

                default:
                    htmlElement.removeEventListener('keydown', eventHandler, false);
                    console.log('Exit');
                    break;
            }

            this.display.draw(this.ctx, this.world, this.viewport);
        }
        
        htmlElement.addEventListener('keydown', eventHandler, false);
    }
    
    rotateHandler() {

        const angle = -this.settings.rotationDegrees * Math.PI / 180;
        const isCenter = this.settings.rotateCenter

        this.display.poligons.map(poligon => (!isCenter) ? poligon.rotate(angle) : poligon.rotateSelfCenter(angle));

        this.display.draw(this.ctx, this.world, this.viewport);
    }

    scaleHandler() {
        
        const htmlElement = document.getElementById('scale');        
        const eventHandler = (event) => {
            
            const rate = this.settings.scaleRate;

            switch (event.key) {
                case 'ArrowUp':
                    this.display.poligons.map(poligon => poligon.scale(rate));
                    break;
                case 'ArrowDown':
                    this.display.poligons.map(poligon => poligon.scale(1/rate));
                    break;
                default:
                    htmlElement.removeEventListener('keydown', eventHandler, false);
                    console.log('Exit');
                    break;
            }

            this.display.draw(this.ctx, this.world, this.viewport);
        }
        
        htmlElement.addEventListener('keydown', eventHandler, false);
    }

    clipHandler() {

        const eventHandler = (e) => {

            const point = this.mouse.positionAsPoint(e);
                
            this.display._reset(this.ctx);

            // Clip
            this.ctx.beginPath()
            this.ctx.rect(point.x, point.y, this.settings.clipWidth, this.settings.clipHeight);
            this.ctx.stroke();
            this.ctx.clip();

            this.display.draw(this.ctx, this.world, this.viewport);
            this.canvasElement.removeEventListener('click', eventHandler, false);
        };

        this.canvasElement.addEventListener('click', eventHandler, false);
    }


    // 
    // Setter's
    // 

    setLineType(type) {
        this.settings.lineType = type;
    }

    setCircleRadius(size) {
        this.settings.circleRadius = size;
    }

    setTranslateSpeed(speed) {
        this.settings.translateSpeed = speed;
    }

    setRotationDegrees(degrees) {
        this.settings.rotationDegrees = degrees;
    }

    setClipHeight(px) {
        this.settings.clipHeight = px;
    }

    setClipWidth(px) {
        this.settings.clipWidth = px;
    }

    setRotationCenter(value) {
        this.settings.rotateCenter = value;
    }

    setScaleRate(value) {
        this.settings.scaleRate = value;
    }

    _renderEventInCanvas(event, eventHandler, index) {

        if (!event.ctrlKey) {
            const point = this.mouse.positionAsWorldPoint(event, this.world, this.viewport);
            this.display.poligons[index].points.push(point);
        } else {
            this.canvasElement.removeEventListener('click', eventHandler, false);
            console.log('exit');
        }

        this.display.draw(this.ctx, this.world, this.viewport);
    }

}

export function toggleSettings() {
    const settingsElement = document.getElementById('settingsBtn');
    const disabled = settingsElement.disabled

    settingsElement.disabled = (disabled) ? false : true;
}

