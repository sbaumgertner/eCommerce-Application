/* eslint-disable max-lines-per-function */
import './account.scss';

import { AppStore } from '../../store/app-store';
import { Page } from '../abstract/page';
import createElement from '../../utils/create-element';
import { Button, IconButton } from '../../components/button/button';
import bottonEdit from '../../assets/icons/icon-edit.svg';
import bottonDelete from '../../assets/icons/icon-delete.svg';
import iconShipping from '../../assets/icons/icon-shipping.svg';
import iconBilling from '../../assets/icons/icon-billing.svg';
import PopUp from '../../components/pop-up/popUp';
import InputField from '../../components/input-field/input-field';
import { Validation } from '../../utils/validation';
import { AccountStore, AccountValidationErrors } from '../../store/account-store';
import ClosePasswordButton from '../../components/button/passwordButton/openButton';
import OpenPasswordButton from '../../components/button/passwordButton/closeButton';
import { AcountAction, NewAddressActionData } from '../../store/action/accountAction';
import { StoreEventType } from '../../types';
import { addRemoveClasslist } from '../../utils/add-remove-classlist';
import { AddressFields } from '../../components/address-fields/address-fields';
import { Checkbox } from '../../components/checkbox/checkbox';
import { ClientResponse, Customer } from '@commercetools/platform-sdk';
import { Scroll } from '../../utils/scroll';

export class AccountPage extends Page {
    private appStore: AppStore;
    private buttonEditPassword: Button;
    private buttonAddress: Button;
    private accountStore: AccountStore;
    private accountAction: AcountAction;
    private currentPasswordField: InputField;
    private newPasswordField: InputField;
    private emailField: InputField;
    private firstNameField: InputField;
    private lastNameField: InputField;
    private birthDateField: InputField;
    private newAddressFields: AddressFields;
    private shippingAddressCheckbox: Checkbox;
    private billingAddressCheckbox: Checkbox;
    private shippingDefaultCheckbox: Checkbox;
    private billingDefaultCheckbox: Checkbox;
    private emailInfo: HTMLElement;
    private firstName: HTMLElement;
    private lastName: HTMLElement;
    private birthDate: HTMLElement;
    private buttonSavePassword: Button;
    private buttonSaveEmail: Button;
    private buttonSaveCommonInfo: Button;
    private buttonSaveNewAddress: Button;
    private buttonEditAddress: Button;
    private editEmailButton: IconButton;
    private apiError: HTMLElement;
    private scroll: Scroll;
    //private adresses;

    constructor(appStore: AppStore) {
        super();
        this.appStore = appStore;
        this.accountStore = new AccountStore();
        this.accountAction = new AcountAction();
        this.buttonEditPassword = new Button('bordered', 'button-edit', 'Edit Password');
        this.editEmailButton = new IconButton({ icon: bottonEdit, type: 'clear' });
        this.buttonAddress = new Button('bordered', 'new-address-button', 'Add new address');
        this.buttonSavePassword = new Button('filled', 'popup__save', 'Save');
        this.buttonSaveEmail = new Button('filled', 'popup__save', 'Save');
        this.buttonSaveCommonInfo = new Button('filled', 'popup__save', 'Save');
        this.buttonSaveNewAddress = new Button('filled', 'popup__save', 'Save');
        this.buttonEditAddress = new Button('filled', 'popup__save', 'Save');
        this.apiError = createElement({ tag: 'div', classes: ['api-error'] });

        this.currentPasswordField = new InputField(
            'password',
            'password',
            'CURRENT PASSWORD',
            'Input current password'
        );
        this.newPasswordField = new InputField('password', 'password', 'NEW PASSWORD', 'Create new password');
        this.emailField = new InputField('email', 'email', 'EMAIL', 'Enter new email');
        this.firstNameField = new InputField('text', 'firstname', 'FIRST NAME', 'Change your Last name');
        this.lastNameField = new InputField('text', 'lastname', 'LAST NAME', 'Change your First name');
        this.birthDateField = new InputField('date', 'birthdate', 'DATE OF BIRTH', 'Change your birth date');
        this.newAddressFields = new AddressFields('New address');
        this.emailInfo = createElement({ tag: 'div', classes: ['email-info'] });
        this.firstName = createElement({ tag: 'div', classes: ['info'] });
        this.lastName = createElement({ tag: 'div', classes: ['info'] });
        this.birthDate = createElement({ tag: 'div', classes: ['info'] });
        this.getPasswordEyeButtons(this.currentPasswordField.getComponent(), this.currentPasswordField.getComponent());
        this.getPasswordEyeButtons(this.newPasswordField.getComponent(), this.newPasswordField.getComponent());
        this.shippingAddressCheckbox = new Checkbox('Use as shipping address', 'shipping-address-checkbox');
        this.shippingAddressCheckbox.setChecked();
        this.billingAddressCheckbox = new Checkbox('Use as billing address', 'billing-address-checkbox');
        this.shippingDefaultCheckbox = new Checkbox('Default address', 'shipping-default-checkbox');
        this.billingDefaultCheckbox = new Checkbox('Default address', 'billing-default-checkbox');
        this.billingAddressCheckbox.setChecked();
        this.accountStore.addChangeListener(StoreEventType.ACCOUNT_ERROR, this.onStoreChange.bind(this));
        this.shippingAddressCheckbox.getComponent().addEventListener('click', () => {
            this.shippingDefaultCheckbox.getComponent().classList.toggle('disabled');
            this.shippingDefaultCheckbox.setUnchecked();
        });
        this.billingAddressCheckbox.getComponent().addEventListener('click', () => {
            this.billingDefaultCheckbox.getComponent().classList.toggle('disabled');
            this.billingDefaultCheckbox.setUnchecked();
        });
        this.scroll = new Scroll();
    }

    public render(): void {
        this.html = document.createElement('div');
        this.html.className = 'account-page';
        this.html.append(this.createEmailWrapper(), this.createInfoWrapper(), this.createAdressWrapper());
        this.getEditPasswordPopUp();
        this.addEventListeners();
    }

    private createEmailWrapper(): HTMLElement {
        const wrapper = createElement({ tag: 'div', classes: ['section'] });
        wrapper.append(this.createEmailSection());
        return wrapper;
    }

    private createInfoWrapper(): HTMLElement {
        const wrapper = createElement({ tag: 'div', classes: ['section'] });
        wrapper.append(this.createInfoSection());
        return wrapper;
    }

    private createAdressWrapper(): HTMLElement {
        const wrapper = createElement({ tag: 'div', classes: ['section'] });
        wrapper.append(this.createAdressSection());
        return wrapper;
    }

    private createEmailSection(): HTMLElement {
        const section = createElement({ tag: 'div', classes: ['section-email'] });
        const sectionHead = createElement({ tag: 'div', classes: ['section-email__head'] });
        const title = createElement({ tag: 'div', classes: ['head-title'] });
        this.accountStore.getFullCustomerName(title);
        sectionHead.append(title);

        const sectionInfo = createElement({ tag: 'div', classes: ['section-email__info'] });
        this.accountStore.getEmailInfo(this.emailInfo);

        sectionInfo.append(this.emailInfo, this.editEmailButton.getComponent());

        section.append(sectionHead, sectionInfo, this.buttonEditPassword.getComponent());

        return section;
    }

    private getEditPasswordPopUp(): HTMLElement {
        const popUpContent = createElement({ tag: 'div', classes: ['popup__content'] });
        popUpContent.append(this.currentPasswordField.getComponent(), this.newPasswordField.getComponent());
        const popUp = new PopUp('Change password', popUpContent, this.apiError, this.buttonSavePassword.getComponent());
        return popUp.getComponent();
    }

    private getEmailPopUp(): HTMLElement {
        const popUpContent = createElement({ tag: 'div', classes: ['popup__content'] });
        popUpContent.append(this.emailField.getComponent());
        const popUp = new PopUp('Change email', popUpContent, this.apiError, this.buttonSaveEmail.getComponent());
        (this.emailField.getComponent().querySelector('.input') as HTMLInputElement).value = this.emailInfo.innerHTML;
        return popUp.getComponent();
    }

    private getPasswordEyeButtons(passwordField: HTMLElement, parentEl: HTMLElement): void {
        const closeButton = new ClosePasswordButton();
        const openButton = new OpenPasswordButton();
        passwordField.append(closeButton.getComponent(), openButton.getComponent());
        closeButton.openPassword(openButton.getComponent(), parentEl);
        openButton.closePassword(closeButton.getComponent(), parentEl);
    }

    private createInfoSection(): HTMLElement {
        const section = createElement({ tag: 'div', classes: ['section-info'] });
        const sectionHead = createElement({ tag: 'div', classes: ['section-info__head'] });
        const title = createElement({ tag: 'div', classes: ['head-title'] });
        title.textContent = 'Common information';
        const button = new Button('bordered', 'button-edit-info', 'Edit');
        button.getComponent().addEventListener('click', () => {
            this.html?.append(this.getFullNamePopUp());
            this.scroll.removeScroll();
        });
        sectionHead.append(title);

        const sectionInfo = createElement({ tag: 'div', classes: ['section-info__content'] });
        const firstNameLabel = createElement({ tag: 'div', classes: ['label'] });
        firstNameLabel.innerText = 'FIRST NAME';
        this.accountStore.getFirstName(this.firstName);

        const lastNameLabel = createElement({ tag: 'div', classes: ['label'] });
        lastNameLabel.innerText = 'LAST NAME';
        this.accountStore.getLastName(this.lastName);

        const birthDateLabel = createElement({ tag: 'div', classes: ['label'] });
        birthDateLabel.innerText = 'DATE OF BIRTH';
        this.accountStore.getDateOfBirth(this.birthDate);

        sectionInfo.append(
            firstNameLabel,
            this.firstName,
            lastNameLabel,
            this.lastName,
            birthDateLabel,
            this.birthDate
        );

        section.append(sectionHead, button.getComponent(), sectionInfo);

        return section;
    }

    private getFullNamePopUp(): HTMLElement {
        const popUpContent = createElement({ tag: 'div', classes: ['popup__content'] });
        popUpContent.append(
            this.firstNameField.getComponent(),
            this.lastNameField.getComponent(),
            this.birthDateField.getComponent()
        );
        const popUp = new PopUp(
            'Edit common information',
            popUpContent,
            this.apiError,
            this.buttonSaveCommonInfo.getComponent()
        );
        (this.firstNameField.getComponent().querySelector('.input') as HTMLInputElement).value =
            this.firstName.innerHTML;
        (this.lastNameField.getComponent().querySelector('.input') as HTMLInputElement).value = this.lastName.innerHTML;
        (this.birthDateField.getComponent().querySelector('.input') as HTMLInputElement).value =
            this.birthDate.innerHTML;
        return popUp.getComponent();
    }

    private createAdressSection(): HTMLElement {
        const section = createElement({ tag: 'div', classes: ['section-address'] });
        const sectionHead = createElement({ tag: 'div', classes: ['section-address__head'] });
        const title = createElement({ tag: 'div', classes: ['head-title'] });
        title.textContent = 'Addresses';
        sectionHead.append(title);

        const sectionInfo = createElement({ tag: 'div', classes: ['section-address__content'] });
        sectionInfo.append(this.createDefaultAddresses(), this.createAllAddresses());

        section.append(sectionHead, sectionInfo, this.buttonAddress.getComponent());

        return section;
    }

    private createDefaultAddresses(): HTMLElement {
        const defaultAdresses = createElement({ tag: 'div', classes: ['address-default'] });

        this.accountStore.getCustomerInfo().then((data) => {
            for (let i = 0; i < data.body.addresses.length; i += 1) {
                if (
                    data.body.addresses[i].id == data.body.defaultShippingAddressId ||
                    data.body.addresses[i].id == data.body.defaultBillingAddressId
                ) {
                    const addressItem = createElement({ tag: 'div', classes: ['address-item'] });
                    addressItem.id = data.body.addresses[i].id as string;
                    const address = createElement({ tag: 'div', classes: ['address-info'] });
                    const buttons = createElement({ tag: 'div', classes: ['address-buttons'] });
                    const addressShippingIcon = new IconButton({ icon: iconShipping, type: 'clear' });
                    const addressBillingIcon = new IconButton({ icon: iconBilling, type: 'clear' });
                    addressShippingIcon.getComponent().classList.add('round');
                    addressBillingIcon.getComponent().classList.add('round');
                    if (addressItem.id == data.body.defaultShippingAddressId) {
                        addRemoveClasslist(addressShippingIcon.getComponent(), address);
                    }
                    if (addressItem.id == data.body.defaultBillingAddressId) {
                        addRemoveClasslist(addressBillingIcon.getComponent(), address);
                    }
                    buttons.append(addressShippingIcon.getComponent(), addressBillingIcon.getComponent());
                    address.innerHTML = `${data.body.addresses[i].streetName} ${data.body.addresses[i].city} ${data.body.addresses[i].postalCode} ${data.body.addresses[i].country}`;
                    addressItem.append(address, buttons);
                    defaultAdresses.append(addressItem);
                }
            }
        });

        return defaultAdresses;
    }

    private createAllAddresses(): HTMLElement {
        const allAdresses = createElement({ tag: 'div', classes: ['address-all'] });
        this.accountStore.getCustomerInfo().then((data) => {
            for (let i = 0; i < data.body.addresses.length; i += 1) {
                allAdresses.append(this.createAddressItem(data, i));
            }
        });
        return allAdresses;
    }

    private createAddressItem(data: ClientResponse<Customer>, i: number): HTMLElement {
        const addressItem = createElement({ tag: 'div', classes: ['address-item'] });

        addressItem.id = data.body.addresses[i].id as string;
        const address = createElement({ tag: 'div', classes: ['address-info'] });
        const buttons = createElement({ tag: 'div', classes: ['address-buttons'] });
        const addressShippingIcon = new IconButton({ icon: iconShipping, type: 'clear' });
        const addressBillingIcon = new IconButton({ icon: iconBilling, type: 'clear' });
        data.body.shippingAddressIds?.forEach((id: string) => {
            if (id == addressItem.id) {
                buttons.append(addressShippingIcon.getComponent());
            }
        });
        data.body.billingAddressIds?.forEach((id: string) => {
            if (id == addressItem.id) {
                buttons.append(addressBillingIcon.getComponent());
            }
        });
        const buttonEdit = new IconButton({ icon: bottonEdit, type: 'clear' });
        buttonEdit.getComponent().classList.add('edit-address-button');
        buttonEdit.getComponent().id = addressItem.id;
        this.editAddress(buttonEdit.getComponent());
        const buttonDelete = new IconButton({ icon: bottonDelete, type: 'clear' });
        buttonDelete.getComponent().id = addressItem.id;
        buttonDelete.getComponent().classList.add('delete-address-button');
        this.deleteAddress(buttonDelete.getComponent());
        address.innerHTML = `${data.body.addresses[i].streetName} ${data.body.addresses[i].city} ${data.body.addresses[i].region} ${data.body.addresses[i].postalCode} ${data.body.addresses[i].country}`;
        addressItem.append(address, buttons, buttonEdit.getComponent(), buttonDelete.getComponent());

        return addressItem;
    }

    private createNewAddressPopUp(): HTMLElement {
        const popUpContent = createElement({ tag: 'div', classes: ['popup__content'] });
        const shippingCheckbox = createElement({ tag: 'div', classes: ['checkboxes'] });

        shippingCheckbox.append(
            this.shippingAddressCheckbox.getComponent(),
            this.shippingDefaultCheckbox.getComponent()
        );
        const billingCheckbox = createElement({ tag: 'div', classes: ['checkboxes'] });
        billingCheckbox.append(this.billingAddressCheckbox.getComponent(), this.billingDefaultCheckbox.getComponent());
        popUpContent.append(this.newAddressFields.getComponent(), shippingCheckbox, billingCheckbox);
        const popUp = new PopUp('', popUpContent, this.apiError, this.buttonSaveNewAddress.getComponent());

        return popUp.getComponent();
    }

    private createEditAddressPopUp(): HTMLElement {
        const popUpContent = createElement({ tag: 'div', classes: ['popup__content'] });
        const shippingCheckbox = createElement({ tag: 'div', classes: ['checkboxes'] });

        shippingCheckbox.append(
            this.shippingAddressCheckbox.getComponent(),
            this.shippingDefaultCheckbox.getComponent()
        );
        const billingCheckbox = createElement({ tag: 'div', classes: ['checkboxes'] });
        billingCheckbox.append(this.billingAddressCheckbox.getComponent(), this.billingDefaultCheckbox.getComponent());
        popUpContent.append(this.newAddressFields.getComponent(), shippingCheckbox, billingCheckbox);
        const popUp = new PopUp('', popUpContent, this.apiError, this.buttonEditAddress.getComponent());

        return popUp.getComponent();
    }

    private sendNewAddressData(): void {
        const data: NewAddressActionData = {};

        if (this.shippingAddressCheckbox.getValue()) {
            data.shippingAddress = this.newAddressFields.getAddressData();
        }
        if (this.billingAddressCheckbox.getValue()) {
            data.billingAddress = this.newAddressFields.getAddressData();
        }
        if (document.querySelector('#shipping-default-checkbox')?.classList.contains('checkbox_checked')) {
            if (data.shippingAddress) {
                data.shippingAddress.isDefault = true;
            }
        }
        if (document.querySelector('#billing-default-checkbox')?.classList.contains('checkbox_checked')) {
            if (data.billingAddress) {
                data.billingAddress.isDefault = true;
            }
        }

        this.accountAction.addNewAddress(data);
    }

    private sendEditAddressData(): void {
        const data: NewAddressActionData = {};

        if (this.shippingAddressCheckbox.getValue()) {
            data.shippingAddress = this.newAddressFields.getAddressData();
        }
        if (this.billingAddressCheckbox.getValue()) {
            data.billingAddress = this.newAddressFields.getAddressData();
        }
        if (document.querySelector('#shipping-default-checkbox')?.classList.contains('checkbox_checked')) {
            if (data.shippingAddress) {
                data.shippingAddress.isDefault = true;
            }
        }
        if (document.querySelector('#billing-default-checkbox')?.classList.contains('checkbox_checked')) {
            if (data.billingAddress) {
                data.billingAddress.isDefault = true;
            }
        }

        this.accountAction.editAddress(data);
    }

    private deleteAddress(button: HTMLButtonElement): void {
        button.onclick = (): void => {
            try {
                this.accountAction.deleteAddress({ id: button.id });
                document.querySelector('.address-all')?.querySelector(`#${button.id}`)?.remove();
            } catch (error) {
                console.log(error);
                //location.reload();
            }
        };
    }

    private editAddress(button: HTMLButtonElement): void {
        button.onclick = (): void => {
            localStorage.setItem('buttonId', button.id);
            this.html?.append(this.createEditAddressPopUp());
            this.scroll.removeScroll();
            document.querySelectorAll('.checkbox-wrapper')[0].textContent = '';
            this.accountStore.getCustomerInfo().then((data) => {
                data.body.addresses.forEach((address) => {
                    if (address.id == button.id) {
                        (document.querySelector('[name="region"]') as HTMLInputElement).value =
                            address.region as string;
                        (document.querySelector('[name="city"]') as HTMLInputElement).value = address.city as string;
                        (document.querySelector('[name="zip"]') as HTMLInputElement).value =
                            address.postalCode as string;
                        (document.querySelectorAll('.form-item')[1] as HTMLInputElement).classList.remove(
                            'form-item_disabled'
                        );
                        (document.querySelector('[name="street"]') as HTMLInputElement).value =
                            address.streetName as string;
                        (document.querySelector('select') as HTMLSelectElement).value = address.country;
                    }
                });
                if (data.body.shippingAddressIds?.includes(button.id)) {
                    this.shippingAddressCheckbox.setChecked();
                } else {
                    this.shippingAddressCheckbox.setUnchecked();
                }
                if (data.body.billingAddressIds?.includes(button.id)) {
                    this.billingAddressCheckbox.setChecked();
                } else {
                    this.billingAddressCheckbox.setUnchecked();
                }
                if (data.body.defaultShippingAddressId == button.id) {
                    this.shippingDefaultCheckbox.setChecked();
                } else {
                    this.shippingDefaultCheckbox.setUnchecked();
                }
                if (data.body.defaultBillingAddressId == button.id) {
                    this.billingDefaultCheckbox.setChecked();
                } else {
                    this.billingDefaultCheckbox.setUnchecked();
                }
            });
        };
    }

    // eslint-disable-next-line max-lines-per-function
    public addEventListeners(): void {
        this.buttonEditPassword.getComponent().addEventListener('click', () => {
            this.html?.append(this.getEditPasswordPopUp());
            this.scroll.removeScroll();
        });

        this.editEmailButton.getComponent().addEventListener('click', () => {
            this.html?.append(this.getEmailPopUp());
            this.scroll.removeScroll();
        });

        this.buttonAddress.getComponent().addEventListener('click', () => {
            this.html?.append(this.createNewAddressPopUp());
            document.querySelectorAll('.checkbox-wrapper')[0].textContent = '';
            this.scroll.removeScroll();
        });

        this.buttonSavePassword.getComponent().addEventListener('click', () => {
            this.currentPasswordField.addValidation(Validation.checkPassword);
            this.newPasswordField.addValidation(Validation.checkPassword);
            this.apiError.textContent = '';
            this.accountAction.changePassword({
                currentPassword: this.currentPasswordField.getValue(),
                newPassword: this.newPasswordField.getValue(),
            });
        });

        this.buttonSaveEmail.getComponent().addEventListener('click', () => {
            this.emailField.addValidation(Validation.checkEmail);
            this.apiError.textContent = '';
            this.accountAction.changeEmail({
                email: this.emailField.getValue(),
            });
        });

        this.buttonSaveCommonInfo.getComponent().addEventListener('click', () => {
            this.firstNameField.addValidation(Validation.checkText);
            this.lastNameField.addValidation(Validation.checkText);
            this.birthDateField.addValidation(Validation.checkDate);
            this.apiError.textContent = '';
            this.accountAction.changeCommonInfo({
                firstName: this.firstNameField.getValue(),
                lastName: this.lastNameField.getValue(),
                birthDate: this.birthDateField.getValue(),
            });
        });

        this.buttonSaveNewAddress.getComponent().onclick = (): void => {
            this.newAddressFields.addValidations();
            this.apiError.textContent = '';
            this.sendNewAddressData();
            // (document.querySelector('.address-all') as HTMLElement).textContent = '';
            // this.accountStore.getCustomerInfo().then((data) => {
            //     for (let i = 0; i < data.body.addresses.length; i += 1) {
            //         (document.querySelector('.address-all') as HTMLElement).append(this.createAddressItem(data, i));
            //     }
            // });
        };

        this.buttonEditAddress.getComponent().addEventListener('click', () => {
            this.newAddressFields.addValidations();
            this.apiError.textContent = '';
            this.sendEditAddressData();
        });

        this.currentPasswordField.addValidation(Validation.checkPassword);
        this.newPasswordField.addValidation(Validation.checkPassword);
        this.emailField.addValidation(Validation.checkEmail);
        this.firstNameField.addValidation(Validation.checkText);
        this.lastNameField.addValidation(Validation.checkText);
        this.birthDateField.addValidation(Validation.checkDate);
        this.newAddressFields.addValidations();
    }

    protected onStoreChange(): void {
        const errors: AccountValidationErrors = this.accountStore.getValidationErrors() as AccountValidationErrors;
        this.apiError.textContent = this.accountStore.getAccountError();
        this.emailField.setError(errors.email || '');
        this.currentPasswordField.setError(errors.currentPassword || '');
        this.newPasswordField.setError(errors.newPassword || '');
        this.firstNameField.setError(errors.firstName || '');
        this.lastNameField.setError(errors.lastName || '');
        this.birthDateField.setError(errors.birthDate || '');
        const summaryErrors = this.accountStore.getSummaryErrors();
        this.apiError.innerHTML = '';
        if (summaryErrors) {
            this.apiError.append(createElement({ tag: 'p', classes: ['errors-header'], text: summaryErrors.message }));
            if (summaryErrors.detailed) {
                this.apiError.append(createElement({ tag: 'p', classes: ['p'], text: 'Detailed information:' }));
                for (let i = 0; i < summaryErrors.detailed.length; i += 1) {
                    this.apiError.append(createElement({ tag: 'p', classes: ['p'], text: summaryErrors.detailed[i] }));
                }
            }
        } else {
            this.apiError.textContent = '';
        }
        this.emailInfo.innerHTML = this.accountStore.getEmailInfo(this.emailInfo);
        this.accountStore.getFirstName(this.firstName);
        this.accountStore.getLastName(this.lastName);
        this.accountStore.getDateOfBirth(this.birthDate);
    }
}
