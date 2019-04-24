export class Point {

    constructor(x = 0, y = 0){
        this.x = parseInt(x);
        this.y = parseInt(y);
    }

    translate(x, y) {
        this.x += parseInt(x);
        this.y += parseInt(y);
    }

    rotate(theta) {
        const aux = this.x;
        this.x = this.x * Math.cos(theta) - this.y * Math.sin(theta);
        this.y = aux * Math.sin(theta) + this.y * Math.cos(theta);
    }

    rotateSelfCenter(centerX, centerY, theta) {
        const aux = this.x;
        this.x = ((this.x-centerX) * Math.cos(theta)) + (-(this.y - centerY) * Math.sin(theta));
        this.y = ((aux-centerX) * Math.sin(theta)) + ((this.y-centerY) * Math.cos(theta));
    }

    scale(x, y) {
        this.x *= x;
        this.y *= y;
    }

    xWorldToViewport(world, viewport) {
        return ((this.x - world.xMin) / (world.xMax - world.xMin)) * (viewport.xMax - viewport.xMin);
    }

    yWorldToViewport(world, viewport) {
        return (1 - (this.y - world.yMin) / (world.yMax - world.yMin)) * (viewport.yMax - viewport.yMin);
    }

    xViewportToWorld(world, viewport) {
        return parseFloat(((this.x - viewport.xMin) / (viewport.xMax - viewport.xMin)) * (world.xMax - world.xMin) + world.xMin).toFixed(2);
    }

    yViewportToWorld(world, viewport) {
        return parseFloat((1 - ((this.y - viewport.yMin) / (viewport.yMax - viewport.yMin))) * (world.yMax - world.yMin) + world.yMin).toFixed(2);
    }

}