import 'swiper/css/bundle';
import Swiper, {EffectFade, Navigation, Pagination, Autoplay} from 'swiper';
import './app-slider.scss';

class AppSlider extends HTMLElement {
	constructor() {
		super();

		this.swiperEl = this.querySelector('.app-slider__swiper');
	}

	connectedCallback() {
		this.swiper = new Swiper(this.swiperEl, {
			modules: [EffectFade, Navigation, Pagination, Autoplay],
			slidesPerView: 'auto',
			// on: {
			// 	transitionStart() {
			// 		console.log('transitionStart');
			// 	},
			// 	slideChangeTransitionStart() {
			// 		console.log('slideChangeTransitionStart');
			// 	},
			// 	slideChangeTransitionEnd() {
			// 		console.log('slideChangeTransitionEnd');
			// 	},
			// 	slideChange() {
			// 		console.log('slideChange');
			// 	},
			// },
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
			autoplay: true,
			loop: true,
		});
	}
}

customElements.define('app-slider', AppSlider);
