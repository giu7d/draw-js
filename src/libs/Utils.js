export function getMousePosition(canvas, event) {

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const position = {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    }

    return position;
}

export function xViewportToWorld(x, world, viewport) {
    return parseFloat(((x - viewport.xMin) / (viewport.xMax - viewport.xMin)) * (world.xMax - world.xMin) + world.xMin).toFixed(2);
}

export function yViewportToWorld(y, world, viewport) {
    return parseFloat((1 - ((y - viewport.yMin) / (viewport.yMax - viewport.yMin))) * (world.yMax - world.yMin) + world.yMin).toFixed(2);
}