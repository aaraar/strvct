import '../scss/main.scss'
import CanvasNest from 'canvas-nest.js';

const _header = document.querySelector('header');
const _menu = document.querySelector('.menu');
const _container = document.querySelector('.container');
init();

function init () {
    const linkArray = document.querySelectorAll('a.item');
    const background = document.querySelector('.background');
    const canvasNests = initNests(background);
    linkHandler(linkArray);
}

function initNests(element) {
    const config = {
        color: '255,255,255',
        pointColor: '125, 125, 125',
        count: 120,
    };
    return new CanvasNest(element, config);
}

function linkHandler (links) {
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const demo = createIframe(e.target.href);
            _menu.classList.toggle('active');
            _header.classList.toggle('back');
            setTimeout(() => {
                _container.appendChild(demo);
                _menu.classList.toggle('inactive');
                demo.classList.toggle('active--demo');
            }, 300);
            handleReturn(demo);
            e.preventDefault();
        })
    })
}

function createIframe (href) {
    const section = document.createElement('section');
    const iFrame = document.createElement('iframe');
    section.classList.add('demo');
    iFrame.src = href;
    section.append(iFrame);
    return section
}

function handleReturn(demo) {
    _header.addEventListener ( 'click',  function _handler(e) {
        _header.classList.toggle('back');
        demo.classList.toggle('active');
        setTimeout(() => {
            demo.remove();
        },300);
        _menu.classList.remove(..._menu.classList);
        _menu.classList.add('active', 'menu');
        e.currentTarget.removeEventListener(e.type, _handler);
        e.preventDefault ()
    });
}