import './address-fields.scss';

import createElement from '../../utils/create-element';
import Component from '../abstract/component';
import { Select } from '../select/select';
import FormField from '../form-field/form-field';
import InputField from '../input-field/input-field';
import { AddressData } from '../../types';
import { Validation, ValidationResult } from '../../utils/validation';

export const countries: Map<string, string> = new Map([
    ['RU', 'Russia'],
    ['BY', 'Belarus'],
    ['GE', 'Georgia'],
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
        this.zipField.setDisable(true);
        this.stateField = new InputField('text', 'region', 'REGION', 'Enter your region');
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
            country: this.countryField.getValue(),
            zip: this.zipField.getValue(),
            state: this.stateField.getValue(),
            city: this.cityField.getValue(),
            street: this.streetField.getValue(),
        };
    }

    public addValidations(): void {
        this.countryField.addValidation(Validation.checkCountry);
        this.countryField.getComponent().addEventListener('change', () => {
            if (Validation.checkCountry(this.countryField.getValue())) {
                this.zipField.setDisable(false);
                this.checkZipValidation();
            }
        });
        this.zipField
            .getInput()
            .getComponent()
            .addEventListener('input', () => this.checkZipValidation());
        this.zipField
            .getInput()
            .getComponent()
            .addEventListener('focus', () => this.checkZipValidation());

        this.stateField.addValidation(Validation.checkText);
        this.cityField.addValidation(Validation.checkText);
        this.streetField.addValidation(Validation.checkNotEmpty);
    }

    private checkZipValidation(): void {
        const result: ValidationResult = Validation.checkZip(this.zipField.getValue(), this.countryField.getValue());
        this.zipField.setError(result.error || '');
    }

    public setErrors(errors: AddressData): void {
        this.countryField.setError(errors.country);
        this.zipField.setError(errors.zip);
        this.stateField.setError(errors.state);
        this.cityField.setError(errors.city);
        this.streetField.setError(errors.street);
    }
}
