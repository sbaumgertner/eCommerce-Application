import './slider.scss';
import Component from '../abstract/component';
import createElement from '../../utils/create-element';
import { IconButton } from '../button/button';

import leftArrowIcon from '../../assets/icons/icon-arrow-left.svg';
import rightArrowIcon from '../../assets/icons/icon-arrow-right.svg';

export class Slider extends Component {
    private sliderContainer: HTMLElement;
    private leftButton: IconButton;
    private rightButton: IconButton;
    private cardNumbers: HTMLElement;
    private currentNumber: number;
    private count: number;

    constructor(images: string[]) {
        super({ tag: 'div', classes: ['slider'] });

        const html = this.getComponent();

        const wrapper = createElement({ tag: 'div', classes: ['slider__wrapper'] });
        this.sliderContainer = createElement({ tag: 'div', classes: ['slider__container'] });
        this.sliderContainer.style.width = images.length * 100 + '%';

        wrapper.append(this.sliderContainer);
        html.append(wrapper);

        this.addImages(images);

        this.leftButton = new IconButton({ icon: leftArrowIcon, type: 'clear', id: 'slider-left' });
        this.rightButton = new IconButton({ icon: rightArrowIcon, type: 'clear', id: 'slider-right' });
        this.cardNumbers = createElement({ tag: 'div', classes: ['slider__numbers'] });

        this.createControls(images.length);
        this.currentNumber = 1;

        this.count = images.length;
        this.updateButtons();
        this.updateNumbers();
        this.addEventListeners();
    }

    private addImages(images: string[]): void {
        for (let i = 0; i < images.length; i += 1) {
            const item = createElement({ tag: 'div', classes: ['slider__card'] });
            item.style.backgroundImage = `url(${images[i]})`;
            this.sliderContainer.append(item);
        }
    }

    private createControls(count: number): void {
        const controls = createElement({ tag: 'div', classes: ['slider__controls'] });

        const buttons = createElement({ tag: 'div', classes: ['slider__buttons'] });
        buttons.append(this.leftButton.getComponent(), this.rightButton.getComponent());

        controls.append(this.cardNumbers, buttons);

        for (let i = 1; i < count + 1; i += 1) {
            const number = createElement({ tag: 'span', classes: ['slider__number'], text: '0' + i });
            number.dataset.id = '' + i;
            this.cardNumbers.append(number);
        }

        this.getComponent().append(controls);
    }

    private addEventListeners(): void {
        this.rightButton.getComponent().addEventListener('click', () => {
            const prev = this.currentNumber;
            this.currentNumber += 1;
            this.moveSlider(prev);
        });
        this.leftButton.getComponent().addEventListener('click', () => {
            const prev = this.currentNumber;
            this.currentNumber -= 1;
            this.moveSlider(prev);
        });
    }

    private updateButtons(): void {
        if (this.currentNumber === 1) {
            this.leftButton.disable();
        } else {
            this.leftButton.enable();
        }
        if (this.currentNumber === this.count) {
            this.rightButton.disable();
        } else {
            this.rightButton.enable();
        }
    }

    private updateNumbers(prevNumber?: number): void {
        if (prevNumber) {
            const num = this.cardNumbers.querySelector(`[data-id="${prevNumber}"]`) as HTMLElement;
            num.classList.remove('slider__number_current');
        }
        const num = this.cardNumbers.querySelector(`[data-id="${this.currentNumber}"]`) as HTMLElement;
        num.classList.add('slider__number_current');
    }

    private moveSlider(prevNumber?: number): void {
        this.sliderContainer.animate([{ transform: `translate(-${(this.currentNumber - 1) * (100 / this.count)}%)` }], {
            duration: 300,
            fill: 'forwards',
        });
        this.updateButtons();
        this.updateNumbers(prevNumber);
    }

    public setToNumber(num: number): void {
        const prev = this.currentNumber;
        this.currentNumber = num;
        this.sliderContainer.animate([{ transform: `translate(-${(this.currentNumber - 1) * (100 / this.count)}%)` }], {
            duration: 1,
            fill: 'forwards',
        });
        this.updateButtons();
        this.updateNumbers(prev);
    }

    public getCurrentNumber(): number {
        return this.currentNumber;
    }
}
