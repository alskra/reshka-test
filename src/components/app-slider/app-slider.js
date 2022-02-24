import 'swiper/css/bundle';
import Swiper, {EffectFade, Navigation, Pagination} from 'swiper';
import './app-slider.scss';

class AppSlider extends HTMLElement {
	constructor() {
		super();

		this.swiperEl = this.querySelector('.app-slider__swiper');
	}

	connectedCallback() {
		this.swiper = new Swiper(this.swiperEl, {
			modules: [EffectFade, Navigation, Pagination],
			slidesPerView: 'auto',
			on: {
				init: () => {
					this.swiperIsInit = true;
				},
				destroy: () => {
					this.swiperIsInit = false;
				},
			},
			effect: 'fade',
			fadeEffect: {
				crossFade: false,
			},
			navigation: {
				prevEl: '.app-slider__button--prev',
				nextEl: '.app-slider__button--next',
			},
			pagination: {
				el: '.app-slider__pagination',
				type: 'fraction',
				modifierClass: 'app-slider__pagination--',
				currentClass: 'app-slider__pagination-current',
				totalClass: 'app-slider__pagination-total',
				formatFractionCurrent(number) {
					return String(number).padStart(2, '0');
				},
				formatFractionTotal(number) {
					return String(number).padStart(2, '0');
				},
			},
		});
	}
}

customElements.define('app-slider', AppSlider);
