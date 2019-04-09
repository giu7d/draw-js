export class Display {

    constructor() {
        this.poligons = [];
    }

    draw(canvas, world, viewport) {
        
        for(let i = 0; i < this.poligons.length; i++) {
            console.log(this.poligons[i]);
            this.poligons[i].draw(canvas,world,viewport);
        }
    }

    // show() {

    // }

}