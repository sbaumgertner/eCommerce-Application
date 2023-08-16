import './icon-with-counter.scss';
import { ElementParams } from '../../types';
import Component from '../abstract/component';
import htmlToElement from '../../utils/html-to-element';

export default class IconWithCounter extends Component {
    constructor(private icon: string, private count: number) {
        const iconCountParams: ElementParams = {
            tag: 'a',
            classes: ['icon-count'],
        };
        super(iconCountParams);
        this.render();
    }

    public setCount(count: number): void {
        this.count = count;
        this.componentElem.dataset.count = `${this.count}`;
    }

    public render(): void {
        const iconEl = htmlToElement(`<div class="icon-count__icon">${this.icon}</div>`);

        this.componentElem.innerHTML = '';
        this.setCount(this.count);
        this.componentElem.append(iconEl);
    }
}
