import './icon-with-counter.scss';
import { ElementParams } from '../../types';
import Component from '../abstract/component';
import htmlToElement from '../../utils/html-to-element';

export default class IconWithCounter extends Component {
    constructor(private icon: string, count: number) {
        const iconCountParams: ElementParams = {
            tag: 'a',
            classes: ['icon-count'],
        };
        super(iconCountParams);
        this.render(count);
    }

    public setCount(count: number): void {
        this.componentElem.dataset.count = `${count}`;
        if (count > 0) {
            this.componentElem.classList.add('icon-count_count');
        }
    }

    public render(count: number): void {
        const iconEl = htmlToElement(`<div class="icon-count__icon">${this.icon}</div>`);

        this.componentElem.innerHTML = '';
        this.setCount(count);
        this.componentElem.append(iconEl);
    }
}
