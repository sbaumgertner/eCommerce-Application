import './account.scss';

import { AppStore } from '../../store/app-store';
import { Page } from '../abstract/page';
import createElement from '../../utils/create-element';
import { Button, IconButton } from '../../components/button/button';
import bottonEdit from '../../assets/icons/icon-edit.svg';
import iconShipping from '../../assets/icons/icon-shipping.svg';
import iconBilling from '../../assets/icons/icon-billing.svg';
import { manageEcom } from '../../api/manageEcom';
import PopUp from '../../components/pop-up/popUp';
import InputField from '../../components/input-field/input-field';
import { Validation } from '../../utils/validation';
import { AccountStore } from '../../store/account-store';
import ClosePasswordButton from '../../components/button/passwordButton/openButton';
import OpenPasswordButton from '../../components/button/passwordButton/closeButton';
import { AcountAction } from '../../store/action/accountAction';
import { StoreEventType } from '../../types';
//import { StoreEventType } from '../../types';

// import InputField from '../../components/input-field/input-field';
// import { LoginAction } from '../../store/action/loginAction';
// import { LoginStore, LoginValidationErrors } from '../../store/login-store';
// import LoginWrapper from '../../components/login-wrapper/login-wrapper';
// import { Validation } from '../../utils/validation';
// import OpenPasswordButton from '../../components/button/passwordButton/closeButton';

export class AccountPage extends Page {
    private appStore: AppStore;
    private manageEcom: manageEcom;
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
    private emailInfo: HTMLElement;
    private firstName: HTMLElement;
    private lastName: HTMLElement;
    private birthDate: HTMLElement;
    private buttonSavePassword: Button;
    private buttonSaveEmail: Button;
    private buttonSaveCommonInfo: Button;
    private editEmailButton: IconButton;
    private apiError: HTMLElement;

    constructor(appStore: AppStore) {
        super();
        this.appStore = appStore;
        this.accountStore = new AccountStore();
        this.accountAction = new AcountAction();
        this.manageEcom = new manageEcom();
        this.buttonEditPassword = new Button('bordered', 'button-edit', 'Edit Password');
        this.editEmailButton = new IconButton({ icon: bottonEdit, type: 'clear' });
        this.buttonAddress = new Button('bordered', 'new-address-button', 'Add new address');
        this.buttonSavePassword = new Button('filled', 'popup__save', 'Save');
        this.buttonSaveEmail = new Button('filled', 'popup__save', 'Save');
        this.buttonSaveCommonInfo = new Button('filled', 'popup__save', 'Save');
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
        this.emailInfo = createElement({ tag: 'div', classes: ['email-info'] });
        this.firstName = createElement({ tag: 'div', classes: ['info'] });
        this.lastName = createElement({ tag: 'div', classes: ['info'] });
        this.birthDate = createElement({ tag: 'div', classes: ['info'] });
        this.getPasswordEyeButtons(this.currentPasswordField.getComponent(), this.currentPasswordField.getComponent());
        this.getPasswordEyeButtons(this.newPasswordField.getComponent(), this.newPasswordField.getComponent());

        this.accountStore.addChangeListener(StoreEventType.ACCOUNT_ERROR, this.onStoreChange.bind(this));
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
        sectionHead.append(title, this.buttonEditPassword.getComponent());

        const sectionInfo = createElement({ tag: 'div', classes: ['section-email__info'] });
        this.accountStore.getEmailInfo(this.emailInfo);

        sectionInfo.append(this.emailInfo, this.editEmailButton.getComponent());

        section.append(sectionHead, sectionInfo);

        return section;
    }

    private getEditPasswordPopUp(): HTMLElement {
        const popUpContent = createElement({ tag: 'div', classes: ['popup__content'] });
        popUpContent.append(this.currentPasswordField.getComponent(), this.newPasswordField.getComponent());
        const popUp = new PopUp('Change password', popUpContent, this.apiError, this.buttonSavePassword.getComponent());
        return popUp.getComponent();
    }

    private getEmailPasswordPopUp(): HTMLElement {
        const popUpContent = createElement({ tag: 'div', classes: ['popup__content'] });
        popUpContent.append(this.emailField.getComponent());
        const popUp = new PopUp('Change email', popUpContent, this.apiError, this.buttonSaveEmail.getComponent());
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
        const button = new Button('bordered', 'button-edit', 'Edit');
        button.getComponent().addEventListener('click', () => {
            this.html?.append(this.getFullNamePopUp());
        });
        sectionHead.append(title, button.getComponent());

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

        section.append(sectionHead, sectionInfo);

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
        return popUp.getComponent();
    }

    private createAdressSection(): HTMLElement {
        const section = createElement({ tag: 'div', classes: ['section-address'] });
        const sectionHead = createElement({ tag: 'div', classes: ['section-address__head'] });
        const title = createElement({ tag: 'div', classes: ['head-title'] });
        title.textContent = 'Addresses';
        const button = new Button('bordered', 'button-set-default', 'Set default');
        sectionHead.append(title, button.getComponent());

        const sectionInfo = createElement({ tag: 'div', classes: ['section-address__content'] });
        this.accountStore.getCustomerInfo().then((data) => {
            for (let i = 0; i < data.body.addresses.length; i += 1) {
                const addressItem = createElement({ tag: 'div', classes: ['address-item'] });
                const address = createElement({ tag: 'div', classes: ['address-info'] });
                const buttons = createElement({ tag: 'div', classes: ['address-buttons'] });
                const addressShippingIcon = new IconButton({ icon: iconShipping, type: 'clear' });
                const addressBillingIcon = new IconButton({ icon: iconBilling, type: 'clear' });
                buttons.append(addressShippingIcon.getComponent(), addressBillingIcon.getComponent());
                address.innerHTML = `${data.body.addresses[i].streetName} ${data.body.addresses[i].city} ${data.body.addresses[i].postalCode} ${data.body.addresses[i].country}`;
                addressItem.append(address, buttons);
                sectionInfo.append(addressItem);
            }
        });

        section.append(sectionHead, sectionInfo, this.buttonAddress.getComponent());

        return section;
    }

    public addEventListeners(): void {
        this.buttonEditPassword.getComponent().addEventListener('click', () => {
            this.html?.append(this.getEditPasswordPopUp());
        });

        this.editEmailButton.getComponent().addEventListener('click', () => {
            this.html?.append(this.getEmailPasswordPopUp());
        });

        this.buttonSavePassword.getComponent().addEventListener('click', () => {
            this.apiError.textContent = '';
            this.accountAction.changePassword({
                currentPassword: this.currentPasswordField.getValue(),
                newPassword: this.newPasswordField.getValue(),
            });
        });

        this.buttonSaveEmail.getComponent().addEventListener('click', () => {
            this.apiError.textContent = '';
            this.accountAction.changeEmail({
                email: this.emailField.getValue(),
            });
        });

        this.buttonSaveCommonInfo.getComponent().addEventListener('click', () => {
            this.apiError.textContent = '';
            this.accountAction.changeCommonInfo({
                firstName: this.firstNameField.getValue(),
                lastName: this.lastNameField.getValue(),
                birthDate: this.birthDateField.getValue(),
            });
        });

        this.currentPasswordField.addValidation(Validation.checkPassword);
        this.newPasswordField.addValidation(Validation.checkPassword);
        this.emailField.addValidation(Validation.checkEmail);
        this.firstNameField.addValidation(Validation.checkText);
        this.lastNameField.addValidation(Validation.checkText);
        this.birthDateField.addValidation(Validation.checkDate);
    }

    protected onStoreChange(): void {
        this.apiError.textContent = this.accountStore.getAccountError();

        this.accountStore.getEmailInfo(this.emailInfo);
        this.accountStore.getFirstName(this.firstName);
        this.accountStore.getLastName(this.lastName);
        this.accountStore.getDateOfBirth(this.birthDate);
    }
}
