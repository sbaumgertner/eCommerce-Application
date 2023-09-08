import { ElementParams } from '../../types';
import createElement from '../../utils/create-element';
import { ValidationResult } from '../../utils/validation';
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

    public setValue(value: string): void {
        if (this.input instanceof Input) {
            this.input.setValue(value);
        }
    }

    public setError(error: string): void {
        this.error.innerText = error;
        this.input.setError(error.length > 0);
    }

    public addValidation(validationFunc: (s: string) => ValidationResult): void {
        this.input.getComponent().addEventListener('input', () => {
            this.checkValidation(validationFunc);
        });
        this.input.getComponent().addEventListener('focus', () => {
            this.checkValidation(validationFunc);
        });
        this.input.getComponent().addEventListener('change', () => {
            this.checkValidation(validationFunc);
        });
    }

    private checkValidation(validationFunc: (s: string) => ValidationResult): void {
        const result: ValidationResult = validationFunc(this.getValue());
        this.setError(result.error || '');
    }

    public setDisable(isDisable: boolean): void {
        this.input.getComponent().disabled = isDisable;
        if (isDisable) {
            this.getComponent().classList.add('form-item_disabled');
        } else {
            this.getComponent().classList.remove('form-item_disabled');
        }
    }

    public getInput(): Input | Select {
        return this.input;
    }
}
