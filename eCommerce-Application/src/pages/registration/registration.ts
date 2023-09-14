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
import { Validation } from '../../utils/validation';
import { LoginAction } from '../../store/action/loginAction';
import CartAPI from '../../api/cartAPI';

const SUCCESS_REGISTARTION_TEMPLATE = `Congratulations! You have successfully registered in the PlantStore.
You will be automatically redirected to the Home page.`;

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
    private errorsField: HTMLElement;
    private button: Button;
    private successField: HTMLElement;

    constructor(appStore: AppStore) {
        super();
        this.appStore = appStore;
        this.registrationStore = new RegistrationStore();
        this.registrationAction = new RegistrationAction();

        this.errorsField = createElement({ tag: 'div', classes: ['registration-errors'] });
        this.successField = createElement({
            tag: 'div',
            classes: ['registration-success'],
            text: SUCCESS_REGISTARTION_TEMPLATE,
        });
        this.successField.classList.add('hidden');

        this.button = new Button('filled', 'registration-button', 'Registration');

        this.firstNameField = new InputField('text', 'firstname', 'FIRST NAME', 'Enter your Last name');
        this.lastNameField = new InputField('text', 'lastname', 'LAST NAME', 'Enter your First name');
        this.birthDateField = new InputField('date', 'birthdate', 'DATE OF BIRTH', 'Enter your birth date');
        this.emailField = new InputField('email', 'email', 'EMAIL', 'Enter your email');
        this.passwordField = new InputField('password', 'password', 'PASSWORD', 'Create your password');

        this.shippingAddress = new AddressFields('Shipping address');
        this.shippingAddress.addValidations();
        this.addressCheckbox = new Checkbox('Use different billing address', 'address-checkbox');
        this.billingAddress = new AddressFields('Billing address');
        this.billingAddress.addValidations();

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
            this.billingAddress.getComponent(),
            this.errorsField
        );
        this.billingAddress.getComponent().classList.add('hidden');

        const filedsWrapper: HTMLElement = createElement({ tag: 'div', classes: ['fields-wrapper'] });
        filedsWrapper.append(fields, this.successField);
        return filedsWrapper;
    }

    public addEventListeners(): void {
        this.button.getComponent().addEventListener('click', () => {
            this.sendRegistrationData();
        });
        this.addressCheckbox.getComponent().addEventListener('click', () => {
            this.billingAddress.getComponent().classList.toggle('hidden');
        });

        this.firstNameField.addValidation(Validation.checkText);
        this.lastNameField.addValidation(Validation.checkText);
        this.birthDateField.addValidation(Validation.checkDate);
        this.emailField.addValidation(Validation.checkEmail);
        this.passwordField.addValidation(Validation.checkPassword);
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

    private showSuccess(): void {
        this.getHtml().querySelector('.registration-fields')?.classList.add('hidden');
        this.button.getComponent().classList.add('hidden');
        this.successField.classList.remove('hidden');
        new CartAPI(this.appStore).createCartForCurrentCustomer({ currency: 'USD' });
        setTimeout(() => {
            new LoginAction().login({
                email: this.registrationStore.getEmail(),
                password: this.registrationStore.getPassword(),
            });
        }, 2000);
    }

    protected onStoreChange(): void {
        const errors: RegValidationErrors = this.registrationStore.getValidationErrors() as RegValidationErrors;
        this.firstNameField.setError(errors.firstName || '');
        this.lastNameField.setError(errors.lastName || '');
        this.birthDateField.setError(errors.birthDate || '');
        this.emailField.setError(errors.email || '');
        this.passwordField.setError(errors.password || '');

        const emptyAdress = {
            country: '',
            zip: '',
            state: '',
            city: '',
            street: '',
            isDefault: true,
        };
        this.shippingAddress.setErrors(errors.shippingAddress || emptyAdress);
        this.billingAddress.setErrors(errors.billingAddress || emptyAdress);

        const summaryErrors = this.registrationStore.getSummaryErrors();
        this.errorsField.innerHTML = '';
        if (summaryErrors) {
            this.errorsField.append(
                createElement({ tag: 'p', classes: ['errors-header'], text: summaryErrors.message })
            );
            if (summaryErrors.detailed) {
                this.errorsField.append(createElement({ tag: 'p', classes: ['p'], text: 'Detailed information:' }));
                for (let i = 0; i < summaryErrors.detailed.length; i += 1) {
                    this.errorsField.append(
                        createElement({ tag: 'p', classes: ['p'], text: summaryErrors.detailed[i] })
                    );
                }
            }
        } else {
            this.showSuccess();
        }
    }
}
