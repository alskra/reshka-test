import ResizeObserver from 'resize-observer-polyfill';

const setScrollbarWidth = () => document.documentElement.style
	.setProperty('--scrollbar-width', `${innerWidth - document.documentElement.clientWidth}px`);

setScrollbarWidth();

const resizeObserver = new ResizeObserver(setScrollbarWidth);

resizeObserver.observe(document.documentElement);
