import './checkbox.scss';

import createElement from '../../utils/create-element';
import Component from '../abstract/component';

export class Checkbox extends Component {
    private checkbox: HTMLElement;

    constructor(label: string, id?: string) {
        super({ tag: 'div', classes: ['checkbox-wrapper'] });
        this.checkbox = createElement({ tag: 'div', classes: ['checkbox'], id: id });
        this.render(label);
    }

    public render(label: string): void {
        const labelEl: HTMLElement = createElement({ tag: 'label', classes: ['checkbox-label'] });
        labelEl.textContent = label;

        this.componentElem.append(this.checkbox, labelEl);
        this.componentElem.addEventListener('click', () => {
            this.checkbox.classList.toggle('checkbox_checked');
        });
    }

    public getValue(): boolean {
        return this.checkbox.classList.contains('checkbox_checked');
    }
}
