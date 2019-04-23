import { Point } from './Point';

export class Mouse {
    
    constructor(canvasElement) {
        this.canvasElement = canvasElement;
        this.position = new Point(0,0);
        this.translation = {x:0, y:0} 
        // this.scale = {x:1, y:1} 
        this.rotation = 0;
    }

    setPosition(event) {

        const rect = this.canvasElement.getBoundingClientRect();
    
        this.position.x = ((event.clientX - rect.left) * (this.canvasElement.width / rect.width));
        this.position.y = ((event.clientY - rect.top) * (this.canvasElement.height / rect.height));

        this.position.translate(this.translation.x, this.translation.y)
        this.position.rotate(this.rotation);
        // this.position.scale(this.scale.x, this.scale.y);
    }
    
    setTranslation(x, y){
        this.translation.x += x;
        this.translation.y += y;
    }

    setRotation(theta) {
        this.rotation += theta;
    }

    // setScale(x, y) {
    //     this.scale.x = x;
    //     this.scale.y = y;
    // }

}


