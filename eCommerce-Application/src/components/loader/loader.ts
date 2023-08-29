import './loader.scss';

import Component from '../abstract/component';
import htmlToElement from '../../utils/html-to-element';

export class Loader extends Component {
    constructor() {
        super({
            tag: 'div',
            classes: ['loader'],
        });
        this.render();
    }

    public render(): void {
        const loaderEl = htmlToElement(`<div class="loader__wrapper">
            <div class="loader__inner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>`);

        this.componentElem.append(loaderEl);
    }
}
