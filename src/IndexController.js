import { Point } from './libs/Point';
import { Poligon } from './libs/Poligon';
import { Window } from './libs/Window';
import { Display } from './libs/Display';
import { Mouse } from './libs/Mouse';


export class IndexController {

    constructor() {
        
        this.canvasElement = document.getElementById('canvas');
        this.ctx = this.canvasElement.getContext('2d');
        
        this.world = new Window(-250, 250, -250, 250);
        this.viewport = new Window(0, 500, 0, 500);
        this.display = new Display();
        this.mouse = new Mouse(this.canvasElement);
       
        this.settings = {
            type: 'std',
            radius: 10,
            speed: 10,
            isCenter: false,
            degrees: 25,
            rate: 1.2,
            clipHeight: 300,
            clipWidth: 300
        }
    }


    setup() {
        
        this.display.poligons.push(
            new Poligon(this.settings.type, [
                new Point(0, this.world.yMax),
                new Point(0, this.world.yMin)
            ])
        );

        this.display.poligons.push(
            new Poligon(this.settings.type, [
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
    
    makeLineHandler() {
        const poligon = new Poligon(this.settings.type);
        const index = this.display.poligons.push(poligon)-1;
        const eventHandler = (e) => this._renderEventInCanvas(e, eventHandler, index);
        
        this._toggleAction();
        
        this.canvasElement.addEventListener('click', eventHandler, false);
    }

    makeCircleHandler() {

        const poligon = new Poligon(this.settings.type, [], this.settings.radius);
        const index = this.display.poligons.push(poligon)-1;
        const eventHandler = (e) => this._renderEventInCanvas(e, eventHandler, index);
        
        this._toggleAction();

        this.canvasElement.addEventListener('click', eventHandler, false);
    }

    translateHandler() {
        
        const htmlElement = document.getElementById("translate");
        
        const eventHandler = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.display.poligons.map(poligon => {
                        poligon.translate(0, this.settings.speed);
                    });
                    break;

                case 'ArrowDown':
                    this.display.poligons.map(poligon => {
                        poligon.translate(0, -this.settings.speed);
                    });
                    break;

                case 'ArrowLeft':
                    this.display.poligons.map(poligon => {
                        poligon.translate(-this.settings.speed, 0);
                    });
                    break;

                case 'ArrowRight':
                    this.display.poligons.map(poligon => {
                        poligon.translate(this.settings.speed, 0);
                    });
                    break;

                default:
                    this._toggleAction(htmlElement.id);
                    htmlElement.removeEventListener('keydown', eventHandler, false);
                    console.log('Exit');
                    break;
            }

            this.display.draw(this.ctx, this.world, this.viewport);
        }

        this._toggleAction(htmlElement.id);        
        htmlElement.addEventListener('keydown', eventHandler, false);
    }
    
    rotateHandler() {

        const angle = -this.settings.degrees * Math.PI / 180;
        const isCenter = this.settings.isCenter

        this.display.poligons.map(poligon => (!isCenter) ? poligon.rotate(angle) : poligon.rotateSelfCenter(angle));

        this.display.draw(this.ctx, this.world, this.viewport);
    }

    scaleHandler() {
        
        const htmlElement = document.getElementById('scale');        
        const eventHandler = (event) => {
            const rate = this.settings.rate;
            switch (event.key) {
                case 'ArrowUp':
                    this.display.poligons.map(poligon => poligon.scale(rate));
                    break;
                case 'ArrowDown':
                    this.display.poligons.map(poligon => poligon.scale(1/rate));
                    break;
                default:
                    this._toggleAction(htmlElement.id);
                    htmlElement.removeEventListener('keydown', eventHandler, false);
                    console.log('Exit');
                    break;
            }

            this.display.draw(this.ctx, this.world, this.viewport);
        }
        
        this._toggleAction(htmlElement.id);
        htmlElement.addEventListener('keydown', eventHandler, false);
    }


    reflectHandler() {
        this.display.poligons.map(poligon => poligon.reflect(1,1));        
        this.display.draw(this.ctx, this.world, this.viewport);
    }

    clipHandler() {

        const htmlElement = document.getElementById("crop");

        const eventHandler = (e) => {

            if (!e.ctrlKey) {

                const point = this.mouse.positionAsPoint(e);
                this.display._reset(this.ctx);
    
                // Clip
                this.ctx.beginPath()
                this.ctx.rect(point.x, point.y, this.settings.clipWidth, this.settings.clipHeight);
                this.ctx.stroke();
                this.ctx.clip();
    
                this.display.draw(this.ctx, this.world, this.viewport);
            }
            
            this._toggleAction(htmlElement.id);
            this.canvasElement.removeEventListener('click', eventHandler, false);
        };

        this._toggleAction(htmlElement.id);
        this.canvasElement.addEventListener('click', eventHandler, false);
    }


    // 
    // Setter's
    // 

    setType(type) {
        this.settings.type = type;
    }

    setRadius(size) {
        this.settings.radius = size;
    }

    setSpeed(speed) {
        this.settings.speed = speed;
    }

    setDegrees(degrees) {
        this.settings.degrees = degrees;
    }

    setClipHeight(px) {
        this.settings.clipHeight = px;
    }

    setClipWidth(px) {
        this.settings.clipWidth = px;
    }

    setIsCenter(value) {
        this.settings.isCenter = value;
    }

    setRate(value) {
        this.settings.rate = value;
    }


    // 
    // Private Methods
    // 

    _renderEventInCanvas(event, eventHandler, index) {

        if (!event.ctrlKey) {
            const point = this.mouse.positionAsWorldPoint(event, this.world, this.viewport);
            this.display.poligons[index].points.push(point);
        } else {
            this.canvasElement.removeEventListener('click', eventHandler, false);
            this._toggleAction();
            console.log('Exit');
        }

        this.display.draw(this.ctx, this.world, this.viewport);
    }

    _toggleAction(selectedElementId = null) {
        
        const htmlElement = [...document.getElementsByTagName('button')];

        htmlElement.map(btn => {
            if (btn.id !== selectedElementId)
                btn.disabled = (btn.disabled) ? false : true;
        });
    }
}