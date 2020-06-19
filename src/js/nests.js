import '../scss/main.scss'
import CanvasNest from 'canvas-nest.js';

init();

function init() {
    const background = initNests(document.querySelector('.background'));
}

function initNests(element) {
    const config = {
        color: '255,255,255',
        pointColor: '125, 125, 125',
        count: 120,
        zIndex: 0
    };
    return new CanvasNest(element, config);
}
