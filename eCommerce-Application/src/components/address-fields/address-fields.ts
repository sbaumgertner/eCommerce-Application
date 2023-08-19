import './address-fields.scss';

import createElement from '../../utils/create-element';
import Component from '../abstract/component';
import { Select } from '../select/select';
import FormField from '../form-field/form-field';
import InputField from '../input-field/input-field';
import { AddressData } from '../../types';

export const countries: Map<string, string> = new Map([
    ['USA', 'USA'],
    ['Australia', 'Australia'],
]);

export class AddressFields extends Component {
    private countryField: FormField;
    private zipField: InputField;
    private stateField: InputField;
    private cityField: InputField;
    private streetField: InputField;

    constructor(title: string) {
        super({ tag: 'div', classes: ['address'] });

        const countrySelect = new Select({
            classes: ['select'],
            placeholder: 'Choose your Country',
            options: countries,
        });
        this.countryField = new FormField('COUNTRY', countrySelect);

        this.zipField = new InputField('text', 'zip', 'ZIP', 'Enter your Zip');
        this.stateField = new InputField('text', 'state', 'STATE', 'Enter your state');
        this.cityField = new InputField('text', 'city', 'CITY', 'Enter your city');
        this.streetField = new InputField('text', 'street', 'STREET', 'Enter your street');

        this.render(title);
    }

    public render(title: string): void {
        const titleEl = createElement({ tag: 'h5', classes: ['address__title'], text: title });
        this.componentElem.append(titleEl, this.countryField.getComponent());

        const inputRow: HTMLElement = createElement({ tag: 'div', classes: ['input-row'] });
        inputRow.append(this.zipField.getComponent(), this.stateField.getComponent());

        this.componentElem.append(inputRow, this.cityField.getComponent(), this.streetField.getComponent());
    }

    public getAddressData(): AddressData {
        return {
            country: this.cityField.getValue(),
            zip: this.zipField.getValue(),
            state: this.stateField.getValue(),
            city: this.cityField.getValue(),
            street: this.streetField.getValue(),
        };
    }
}
