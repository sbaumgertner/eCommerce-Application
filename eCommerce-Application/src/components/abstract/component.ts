import { ElementParams } from '../../types';
import createElement from '../../utils/create-element';

export default abstract class Component {
    protected componentElem: HTMLElement;

    constructor(elemParams: ElementParams) {
        this.componentElem = createElement(elemParams);
    }

    public getComponent(): HTMLElement {
        return this.componentElem;
    }
}
