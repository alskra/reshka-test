const setVH = () => document.documentElement.style.setProperty('--vh', `${innerHeight / 100}px`);

setVH();
window.addEventListener('resize', setVH);
