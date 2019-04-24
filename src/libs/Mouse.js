import { Point } from './Point';

export class Mouse {
    
    constructor(canvasElement) {
        this.canvasElement = canvasElement;
        this.point = new Point(0,0);
    }

    position(event) {
        const rect = this.canvasElement.getBoundingClientRect();
    
        this.point.x = ((event.clientX - rect.left) * (this.canvasElement.width / rect.width));
        this.point.y = ((event.clientY - rect.top) * (this.canvasElement.height / rect.height));
    }

    positionAsPoint(event) {
        this.position(event);
        return this.point;
    }

    positionAsWorldPoint(event, world, viewport) {

        this.position(event);

        const x = this.point.xViewportToWorld(world, viewport);
        const y = this.point.yViewportToWorld(world, viewport);

        return new Point(x, y);
    }
}


