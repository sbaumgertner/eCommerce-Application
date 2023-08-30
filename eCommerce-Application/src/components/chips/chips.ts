import './chips.scss';

import createElement from '../../utils/create-element';
import Component from '../abstract/component';

export class Chips extends Component {
    constructor(text: string, img?: string) {
        super({ tag: 'div', classes: ['chips'] });
        this.render(text, img);
        this.componentElem.addEventListener('click', () => {
            this.componentElem.classList.toggle('chips_active');
        });
    }

    public render(text: string, img?: string): void {
        const textEl: HTMLElement = createElement({ tag: 'div', classes: ['chips__text'], text });

        if (img) {
            const imgEl: HTMLElement = createElement({ tag: 'img', classes: ['chips__img'] });
            imgEl.setAttribute('src', img);
            textEl.classList.add('chips__text_left');
            this.componentElem.append(imgEl);
        }
        this.componentElem.append(textEl);
    }

    public setActive(): void {
        this.componentElem.classList.add('chips_active');
    }
    public setInactive(): void {
        this.componentElem.classList.remove('chips_active');
    }

    public getValue(): boolean {
        return this.componentElem.classList.contains('chips_active');
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    public setHandler(handler: Function): void {
        this.componentElem.addEventListener('click', handler());
    }
}
