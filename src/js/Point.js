export class Point {

    // Nome:
    //      Point(x: double, y: double)
    // Objetivo:
    //      Criar um ponto, coordenada.
    
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    // Nome:
    //      xWorldToViewport(world: Window, viewport: Window)
    //      yWorldToViewport(world: Window, viewport: Window)
    // Objetivo:
    //      Converter cordenada de mundo para viewport
    
    xWorldToViewport(world, viewport) {
        return ((this.x - world.xMin) / (world.xMax - world.xMin)) * (viewport.xMax - viewport.xMin);
    }

    yWorldToViewport(world, viewport) {
        return (1 - (this.y - world.yMin) / (world.yMax - world.yMin)) * (viewport.yMax - viewport.yMin);
    }


}