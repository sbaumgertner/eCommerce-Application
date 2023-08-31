import './popUp.scss';

import createElement from '../../utils/create-element';
import Component from '../abstract/component';
//import { Button } from '../button/button';

export default class PopUp extends Component {
    constructor(title: string, content: HTMLElement, errorMessage: HTMLElement, button: HTMLButtonElement) {
        super({ tag: 'div', classes: ['dimming-window'] });

        this.componentElem.append(this.createPopUp(title, content, errorMessage, button));
    }

    private createPopUp(
        title: string,
        content: HTMLElement,
        errorMessage: HTMLElement,
        button: HTMLButtonElement
    ): HTMLElement {
        const popUp = createElement({ tag: 'div', classes: ['popup'] });
        const popUpTitle = createElement({ tag: 'h5', classes: ['popup__title'], text: title });
        //const popUpContent = createElement({ tag: 'div', classes: ['popup__content'] });
        const closeButton = createElement({ tag: 'div', classes: ['popup__close'] });
        this.closePopUp(closeButton);
        //const popUpButton = new Button('filled', 'popup__save', 'Save');
        popUp.append(popUpTitle, closeButton, content, errorMessage, button);
        return popUp;
    }

    private closePopUp(button: HTMLElement): void {
        button.addEventListener('click', () => {
            this.componentElem.remove();
        });
    }
}
