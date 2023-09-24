import './select.scss';

import { SelectElementParams } from '../../types';
import createElement from '../../utils/create-element';
import Component from '../abstract/component';

export class Select extends Component {
    constructor(params: SelectElementParams) {
        super({ tag: 'select', classes: params.classes, id: params.id });

        if (params.name) {
            this.getComponent().name = params.name;
        }

        if (params.placeholder) {
            this.addOption('placeholder', params.placeholder, true, true);
        }
        for (const [value, text] of params.options) {
            this.addOption(value, text);
        }
    }

    private addOption(value: string, text: string, selected = false, disabled = false): void {
        const option = createElement({ tag: 'option', classes: ['select-option'] }) as HTMLOptionElement;
        option.value = value;
        option.text = text;
        option.selected = selected;
        option.disabled = disabled;
        this.getComponent().add(option);
    }

    public getComponent(): HTMLSelectElement {
        return this.componentElem as HTMLSelectElement;
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
