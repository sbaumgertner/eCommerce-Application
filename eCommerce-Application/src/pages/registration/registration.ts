import './registration.scss';

import { Button } from '../../components/button/button';
import LoginWrapper from '../../components/login-wrapper/login-wrapper';
import { AppStore } from '../../store/app-store';
import { Page } from '../abstract/page';
import createElement from '../../utils/create-element';
import InputField from '../../components/input-field/input-field';
import { RegValidationErrors, RegistrationStore } from '../../store/registration-store';
import { RegistrationAction, RegistrationActionData } from '../../store/action/registrationAction';
import { StoreEventType } from '../../types';
import { AddressFields } from '../../components/address-fields/address-fields';
import { Checkbox } from '../../components/checkbox/checkbox';

export class RegisterPage extends Page {
    private appStore: AppStore;
    private registrationStore: RegistrationStore;
    private registrationAction: RegistrationAction;

    private firstNameField: InputField;
    private lastNameField: InputField;
    private birthDateField: InputField;
    private emailField: InputField;
    private passwordField: InputField;
    private shippingAddress: AddressFields;
    private addressCheckbox: Checkbox;
    private billingAddress: AddressFields;
    private button: Button;

    constructor(appStore: AppStore) {
        super();
        this.appStore = appStore;
        this.registrationStore = new RegistrationStore();
        this.registrationAction = new RegistrationAction();
        this.button = new Button('filled', 'registration-button', 'Registration');

        this.firstNameField = new InputField('text', 'firstname', 'FIRST NAME', 'Enter your Last name');
        this.lastNameField = new InputField('text', 'lastname', 'LAST NAME', 'Enter your First name');
        this.birthDateField = new InputField('date', 'birthdate', 'DATE OF BIRTH', 'Enter your birth date');
        this.emailField = new InputField('email', 'email', 'EMAIL', 'Enter your email');
        this.passwordField = new InputField('password', 'password', 'PASSWORD', 'Create your password');

        this.shippingAddress = new AddressFields('Shipping address');
        this.addressCheckbox = new Checkbox('Use different billing address', 'address-checkbox');
        this.billingAddress = new AddressFields('Billing address');

        this.registrationStore.addChangeListener(StoreEventType.REGISTRATION_ERROR, this.onStoreChange.bind(this));
    }

    public render(): void {
        this.html = document.createElement('div');
        this.html.className = 'registration-page';
        this.html.append(this.createWrapper());
        this.addEventListeners();
    }

    private createWrapper(): HTMLElement {
        const wrapper = new LoginWrapper(this.appStore, 'Registration', this.createFields(), this.button);
        return wrapper.getComponent();
    }

    private createFields(): HTMLElement {
        const fields: HTMLElement = createElement({ tag: 'div', classes: ['registration-fields'] });
        const inputRow: HTMLElement = createElement({ tag: 'div', classes: ['input-row'] });
        inputRow.append(this.firstNameField.getComponent(), this.lastNameField.getComponent());
        fields.append(
            inputRow,
            this.birthDateField.getComponent(),
            this.emailField.getComponent(),
            this.passwordField.getComponent(),
            this.shippingAddress.getComponent(),
            this.addressCheckbox.getComponent(),
            this.billingAddress.getComponent()
        );
        this.billingAddress.getComponent().classList.add('hidden');
        return fields;
    }

    public addEventListeners(): void {
        this.button.getComponent().addEventListener('click', () => {
            this.sendRegistrationData();
        });
        this.addressCheckbox.getComponent().addEventListener('click', () => {
            this.billingAddress.getComponent().classList.toggle('hidden');
        });
    }

    private sendRegistrationData(): void {
        const data: RegistrationActionData = {
            firstName: this.firstNameField.getValue(),
            lastName: this.lastNameField.getValue(),
            birthDate: this.birthDateField.getValue(),
            email: this.emailField.getValue(),
            password: this.passwordField.getValue(),
            shippingAddress: this.shippingAddress.getAddressData(),
        };
        if (this.addressCheckbox.getValue()) {
            data.billingAddress = this.billingAddress.getAddressData();
        }

        this.registrationAction.registration(data);
    }

    protected onStoreChange(): void {
        const errors: RegValidationErrors = this.registrationStore.getValidationErrors() as RegValidationErrors;
        //if (errors.firstName) {
        this.firstNameField.setError(errors.firstName || '');
        this.lastNameField.setError(errors.lastName || '');
        //}
        //this.firstNameField.setError(this.registrationStore.getFirstNameError());
    }
}
