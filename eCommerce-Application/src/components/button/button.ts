import './button.scss';
import { ElementParams } from '../../types';
import Component from '../abstract/component';

export class Button extends Component {
    constructor(type: 'filled' | 'bordered' | 'text', id?: string, text?: string) {
        const classes = [];
        classes.push('button');
        classes.push(`button_${type}`);
        const params: ElementParams = {
            tag: 'button',
            classes: classes,
        };
        if (id) {
            params.id = id;
        }
        if (text) {
            params.text = text;
        }
        super(params);
    }

    public getComponent(): HTMLButtonElement {
        return this.componentElem as HTMLButtonElement;
    }

    public disable(): void {
        this.getComponent().disabled = true;
    }

    public enable(): void {
        this.getComponent().disabled = false;
    }
}
