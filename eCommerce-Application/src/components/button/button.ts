import './button.scss';
import { ElementParams } from '../../types';
import Input from '../abstract/input';

export class Button extends Input {
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
}
