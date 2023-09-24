import './button.scss';
import { ElementParams } from '../../types';
import Component from '../abstract/component';
import htmlToElement from '../../utils/html-to-element';

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

export type IconButtonParams = {
    icon: string;
    type: 'filled' | 'bordered' | 'clear';
    id?: string;
};

export class IconButton extends Component {
    constructor(params: IconButtonParams) {
        const { icon, type, id } = params;
        const componentParams: ElementParams = {
            tag: 'button',
            classes: ['button', 'button-icon', `button_${type}`],
        };
        if (id) {
            componentParams.id = id;
        }
        super(componentParams);
        this.componentElem.append(htmlToElement(`<div class="button__icon">${icon}</div>`));
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
