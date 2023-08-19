import { ElementParams } from '../../types';
import createElement from '../../utils/create-element';
import Component from '../abstract/component';
import Input from '../input/input';
import { Select } from '../select/select';

export default class FormField extends Component {
    private input: Input | Select;
    private error: HTMLElement;

    constructor(label: string, input: Input | Select) {
        const inputParams: ElementParams = {
            tag: 'div',
            classes: ['form-item'],
        };
        super(inputParams);
        this.input = input;
        this.error = createElement({ tag: 'div', classes: ['error'] });
        this.render(label);
    }

    public render(inputLabel: string): void {
        this.componentElem.innerHTML = '';
        this.componentElem.append(this.createLabel(inputLabel), this.input.getComponent(), this.error);
    }

    private createLabel(inputLabel: string): HTMLElement {
        const label = createElement({ tag: 'label', classes: ['label'] });
        label.textContent = inputLabel;

        return label;
    }

    public getValue(): string {
        return this.input.getValue();
    }

    public setError(error: string): void {
        this.error.innerText = error;
        this.input.setError(error.length > 0);
    }
}
