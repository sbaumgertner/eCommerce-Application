import './input-field.scss';
import Input from '../input/input';
import FormField from '../form-field/form-field';

export default class InputField extends FormField {
    constructor(
        readonly typeInput: string,
        readonly nameInput: string,
        readonly inputLabel: string,
        readonly placeholder: string
    ) {
        const input = new Input({
            classes: ['input'],
            type: typeInput,
            name: nameInput,
            placeholder: placeholder,
        });
        super(inputLabel, input);
    }
}
