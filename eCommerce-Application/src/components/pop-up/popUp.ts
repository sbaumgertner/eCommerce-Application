import './popUp.scss';

import createElement from '../../utils/create-element';
import Component from '../abstract/component';
import { Scroll } from '../../utils/scroll';

export default class PopUp extends Component {
    private scroll: Scroll;
    constructor(title: string, content: HTMLElement, errorMessage: HTMLElement, button: HTMLButtonElement) {
        super({ tag: 'div', classes: ['dimming-window'] });
        this.scroll = new Scroll();
        this.componentElem.append(this.createPopUp(title, content, errorMessage, button));
        this.scroll.removeScroll();
    }

    private createPopUp(
        title: string,
        content: HTMLElement,
        errorMessage: HTMLElement,
        button: HTMLButtonElement
    ): HTMLElement {
        const popUp = createElement({ tag: 'div', classes: ['popup'] });
        const popUpTitle = createElement({ tag: 'h5', classes: ['popup__title'], text: title });
        const closeButton = createElement({ tag: 'div', classes: ['popup__close'] });

        this.closePopUp(closeButton);
        this.closePopUp(this.componentElem);
        button.addEventListener('click', () => {
            this.scroll.addScroll();
        });
        popUp.append(popUpTitle, closeButton, content, errorMessage, button);
        return popUp;
    }

    public closePopUp(button: HTMLElement): void {
        button.addEventListener('click', (e) => {
            if (e.target === button) {
                this.componentElem.remove();
                this.scroll.addScroll();
            }
        });
    }
}
