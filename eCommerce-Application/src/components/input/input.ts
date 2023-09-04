import { InputElementParams } from '../../types';
import Component from '../abstract/component';

export default class Input extends Component {
    constructor(inputParams: InputElementParams) {
        super({ tag: 'input', classes: inputParams.classes, id: inputParams.id });

        const el: HTMLInputElement = this.getComponent();

        el.type = inputParams.type;
        el.name = inputParams.name;
        if (inputParams.placeholder) {
            el.placeholder = inputParams.placeholder;
        }
    }

    public getComponent(): HTMLInputElement {
        return this.componentElem as HTMLInputElement;
    }

    public getValue(): string {
        return this.getComponent().value;
    }

    public setValue(value: string): void {
        this.getComponent().value = value;
    }

    public setError(isError: boolean): void {
        if (isError) {
            this.getComponent().classList.add('input_invalid');
        } else {
            this.getComponent().classList.remove('input_invalid');
        }
    }
}
