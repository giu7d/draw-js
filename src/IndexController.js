import { Point } from './libs/Point';
import { Poligon } from './libs/Poligon';
import { Window } from './libs/Window';
import { Display } from './libs/Display';
import { Mouse } from './libs/Mouse';


export class IndexController {

    constructor() {
        
        // HTML Elements
        this.canvasElement = document.getElementById('canvas');
        this.mouseDisplayElement = document.getElementById('mouseCoordinatesDisplay');        
        
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
            zoom: 1.2,
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
    
    mouseCoordinateHandler(event) {

        this.mouse.setPosition(event);
        
        const x = this.mouse.position.xViewportToWorld(this.world, this.viewport);
        const y = this.mouse.position.yViewportToWorld(this.world, this.viewport);

        this.mouseDisplayElement.innerHTML = `X: ${x} Y:${y}`;
    }

    // shapes
    
    makeLineHandler() {
        
        const poligon = new Poligon(this.settings.lineType);
        const eventHandler = (e) => this._drawEvent(e, eventHandler, poligon);
    
        toggleSettings();

        this.canvasElement.addEventListener('click', eventHandler, false);
    }

    makeCircleHandler() {

        const poligon = new Poligon(this.settings.lineType, [], this.settings.circleRadius);
        const eventHandler = (e) => this._drawEvent(e, eventHandler, poligon);
        
        toggleSettings();

        this.canvasElement.addEventListener('click', eventHandler, false);
    }

    // tools

    translateHandler() {
        
        const htmlElement = document.getElementById("translate");

        const eventHandler = (event) => {
            
            const key = event.key;
            
            switch(key) {
                case 'ArrowUp':

                    // this.ctx.translate(0, -this.settings.translateSpeed);
                    // this.mouse.setTranslation(0, this.settings.translateSpeed);
                    
                    this.display.poligons.map(poligon => {
                        poligon.translate(0, this.settings.translateSpeed);
                    });

                    break;

                case 'ArrowDown':
                    this.ctx.translate(0, this.settings.translateSpeed);
                    this.mouse.setTranslation(0, -this.settings.translateSpeed);
                    break;

                case 'ArrowLeft':
                    this.ctx.translate(-this.settings.translateSpeed, 0);
                    this.mouse.setTranslation(this.settings.translateSpeed, 0);
                    break;

                case 'ArrowRight':
                    this.ctx.translate(this.settings.translateSpeed, 0);
                    this.mouse.setTranslation(-this.settings.translateSpeed, 0);
                    break;

                default:
                    toggleSettings();
                    htmlElement.removeEventListener('keydown', eventHandler, false);
                    console.log('Exit');
                    break;
            }

            this.display.draw(this.ctx, this.world, this.viewport);
        }
        

        toggleSettings();
        htmlElement.addEventListener('keydown', eventHandler, false);

    }
    
    rotateHandler() {
        
        if (this.settings.rotateCenter){
            this.ctx.translate(this.ctx.canvas.width/2, this.ctx.canvas.height/2);
            this.ctx.rotate(this.settings.rotationDegrees * Math.PI / 180);
            this.ctx.translate(-this.ctx.canvas.width / 2, -this.ctx.canvas.height / 2);
        } else {            
            this.ctx.rotate(this.settings.rotationDegrees * Math.PI / 180);
            this.mouse.setRotation(-this.settings.rotationDegrees * Math.PI / 180);
        }
        
        this.display.draw(this.ctx, this.world, this.viewport);
    }

    scaleHandler() {
        
        const htmlElement = document.getElementById('scale');
        toggleSettings();
        
        const eventHandler = (event) => {
            
            const key = event.key;
            const scale = this.settings.zoom;

            switch (key) {
                case 'ArrowUp':
                    this.ctx.scale(scale, scale);
                    // this.mouse.setScale(1.2,1.2);
                    break;
                case 'ArrowDown':
                    const newScale = Math.abs((scale-1)-1)
                    this.ctx.scale(newScale,newScale);
                    // this.mouse.setScale(scale,scale);
                    break;
                case 'Control':
                    toggleSettings();
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

            this.mouse.setPosition(e);
                
            const x = this.mouse.position.x;
            const y = this.mouse.position.y;
            
            this.display._reset(this.ctx);

            this.ctx.beginPath()
            this.ctx.rect(x, y, this.settings.clipWidth, this.settings.clipHeight);
            this.ctx.stroke();
            this.ctx.clip();

            this.display.draw(this.ctx, this.world, this.viewport);
            this.canvasElement.removeEventListener('click', eventHandler, false);

            toggleSettings();
        };

        toggleSettings();
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


    _drawEvent(event, handlerFunction, poligon) {

        if (!event.ctrlKey) {

            this.mouse.setPosition(event);

            const x = this.mouse.position.xViewportToWorld(this.world, this.viewport);
            const y = this.mouse.position.yViewportToWorld(this.world, this.viewport);

            poligon.points.push(new Point(x, y));

            this.display.poligons.push(poligon);
            this.display.draw(this.ctx, this.world, this.viewport);
        } else {
            toggleSettings();
            this.canvasElement.removeEventListener('click', handlerFunction, false);
            console.log('exit');
        }
    }

}

export function toggleSettings() {
    const settingsElement = document.getElementById('settingsBtn');
    const disabled = settingsElement.disabled

    settingsElement.disabled = (disabled) ? false : true;
}

