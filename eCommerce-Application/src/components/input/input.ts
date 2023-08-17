import './input.scss';
import { AppStore } from '../../store/app-store';
import { ElementParams } from '../../types';
import createElement from '../../utils/create-element';
import Component from '../abstract/component';

export default class InputField extends Component {
    private appStore: AppStore;

    constructor(
        appStore: AppStore,
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
        this.appStore = appStore;
        this.typeInput = typeInput;
        this.nameInput = nameInput;
        this.inputLabel = inputLabel;
        this.placeholder = placeholder;

        this.render();
    }

    public render(): void {
        this.componentElem.innerHTML = '';
        this.componentElem.append(this.createLabel(), this.createInput(), this.createError());
    }

    private createLabel(): HTMLElement {
        const label = createElement({ tag: 'label', classes: ['label'] });
        label.setAttribute('for', this.nameInput);
        label.textContent = this.inputLabel;

        return label;
    }

    private createInput(): HTMLElement {
        const input = createElement({ tag: 'input', classes: ['input'] });
        input.setAttribute('name', this.nameInput);
        input.setAttribute('type', this.typeInput);
        input.setAttribute('placeholder', this.placeholder);
        return input;
    }

    private createError(): HTMLElement {
        const error = createElement({ tag: 'div', classes: ['error'] });
        return error;
    }
}
