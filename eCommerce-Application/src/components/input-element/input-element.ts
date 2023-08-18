import InteractComponent from '../abstract/interact-component';

export default class InputElement extends InteractComponent {
    constructor(type: string, classes: string[], name: string, placeholder?: string, id?: string) {
        super({ tag: 'input', classes: classes, id: id });

        const el: HTMLInputElement = this.getComponent();

        el.type = type;
        el.name = name;
        if (placeholder) {
            el.placeholder = placeholder;
        }
    }

    public getValue(): string {
        return this.getComponent().value;
    }
}
