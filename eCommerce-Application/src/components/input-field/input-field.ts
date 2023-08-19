import './input-field.scss';
import { ElementParams } from '../../types';
import createElement from '../../utils/create-element';
import Component from '../abstract/component';
import Input from '../input/input';

export default class InputField extends Component {
    private input: Input;
    private error: HTMLElement;

    constructor(
        readonly typeInput: string,
        readonly nameInput: string,
        readonly inputLabel: string,
        readonly placeholder: string
    ) {
        const inputParams: ElementParams = {
            tag: 'div',
            classes: ['form-item'],
        };
        super(inputParams);
        this.input = new Input({
            classes: ['input'],
            type: typeInput,
            name: nameInput,
            placeholder: placeholder,
        });
        this.error = createElement({ tag: 'div', classes: ['error'] });
        this.render(inputLabel, typeInput);
    }

    public render(inputLabel: string, nameInput: string): void {
        this.componentElem.innerHTML = '';
        this.componentElem.append(this.createLabel(inputLabel, nameInput), this.input.getComponent(), this.error);
    }

    private createLabel(inputLabel: string, nameInput: string): HTMLElement {
        const label = createElement({ tag: 'label', classes: ['label'] });
        label.setAttribute('for', nameInput);
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
