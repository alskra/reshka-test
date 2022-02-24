import ResizeObserver from 'resize-observer-polyfill';
import './icon-svg.scss';

const requireIcon = require.context(
	'../../images/icons/svg?raw',
	false,
	/\.svg$/,
);

const icons = {};

const resizeObserver = new ResizeObserver((entries) => {
	entries.forEach((entry) => {
		const contentBoxSize = entry.contentBoxSize && entry.contentBoxSize[0] || entry.contentBoxSize;
		const iconWidth = contentBoxSize && contentBoxSize.inlineSize || entry.contentRect.width;
		const iconHeight = contentBoxSize && contentBoxSize.blockSize || entry.contentRect.height;
		const viewBox = `0 0 ${iconWidth / (iconHeight || 1) * entry.target.svgViewBoxHeight} ${entry.target.svgViewBoxHeight}`;

		entry.target.svgEl.setAttribute('viewBox', viewBox);
	});
});

requireIcon.keys().forEach((iconPath) => {
	const iconName = iconPath
		.split('/')
		.pop()
		.replace(/\.\w+$/, '');

	icons[iconName] = requireIcon(iconPath).default || requireIcon(iconPath);
});

class IconSvg extends HTMLElement {
	static get observedAttributes() {
		return ['name'];
	}

	get name() {
		return this.getAttribute('name');
	}

	constructor() {
		super();

		this.attachShadow({mode: 'open'});
	}

	update() {
		this.shadowRoot.innerHTML = icons[this.name];
		this.svgEl = this.shadowRoot.querySelector('svg');

		Object.assign(this.svgEl.style, {
			display: 'block',
			width: '100%',
			height: '100%',
		});

		resizeObserver.unobserve(this);

		if (['arrow-left', 'arrow-right'].includes(this.name)) {
			this.svgViewBoxHeight = +this.svgEl.getAttribute('viewBox').split(/\s+/).pop();
			resizeObserver.observe(this);
		}
	}

	disconnected() {
		resizeObserver.unobserve(this);
	}

	attributeChangedCallback(name) {
		if (name === 'name') {
			this.update();
		}
	}
}

customElements.define('icon-svg', IconSvg);

export default IconSvg;
export {icons};
