import './account.scss';

import { AppStore } from '../../store/app-store';
import { Page } from '../abstract/page';
import createElement from '../../utils/create-element';
import { Button, IconButton } from '../../components/button/button';
import bottonEdit from '../../assets/icons/icon-edit.svg';
import iconShipping from '../../assets/icons/icon-shipping.svg';
import iconBilling from '../../assets/icons/icon-billing.svg';
import { manageEcom } from '../../api/manageEcom';
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
    private buttonAddress: Button;

    constructor(appStore: AppStore) {
        super();
        this.appStore = appStore;
        this.manageEcom = new manageEcom();
        this.buttonAddress = new Button('bordered', 'new-address-button', 'Add new address');
    }

    public render(): void {
        this.html = document.createElement('div');
        this.html.className = 'account-page';
        this.html.append(this.createEmailWrapper(), this.createInfoWrapper(), this.createAdressWrapper());
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
        const getFirstName = this.manageEcom.getCustomerById().then((data) => {
            title.innerHTML = data.body.firstName as string;
        });
        const getLastName = this.manageEcom.getCustomerById().then((data) => {
            title.innerHTML += ` ${data.body.lastName as string}`;
        });
        Promise.all([getFirstName, getLastName]);
        const button = new Button('bordered', 'button-edit', 'Edit Password');
        sectionHead.append(title, button.getComponent());

        const sectionInfo = createElement({ tag: 'div', classes: ['section-email__info'] });
        const emailInfo = createElement({ tag: 'div', classes: ['email-info'] });
        this.manageEcom.getCustomerById().then((data) => {
            emailInfo.innerHTML = data.body.email;
        });
        const buttonEdit = new IconButton({ icon: bottonEdit, type: 'clear' });
        sectionInfo.append(emailInfo, buttonEdit.getComponent());

        section.append(sectionHead, sectionInfo);

        return section;
    }

    private createInfoSection(): HTMLElement {
        const section = createElement({ tag: 'div', classes: ['section-info'] });
        const sectionHead = createElement({ tag: 'div', classes: ['section-info__head'] });
        const title = createElement({ tag: 'div', classes: ['head-title'] });
        title.textContent = 'Common information';
        const button = new Button('bordered', 'button-edit', 'Edit');
        sectionHead.append(title, button.getComponent());

        const sectionInfo = createElement({ tag: 'div', classes: ['section-info__content'] });
        const firstNameLabel = createElement({ tag: 'div', classes: ['label'] });
        firstNameLabel.innerText = 'FIRST NAME';
        const firstName = createElement({ tag: 'div', classes: ['info'] });
        this.manageEcom.getCustomerById().then((data) => {
            firstName.innerHTML = data.body.firstName as string;
        });

        const lastNameLabel = createElement({ tag: 'div', classes: ['label'] });
        lastNameLabel.innerText = 'LAST NAME';
        const lastName = createElement({ tag: 'div', classes: ['info'] });
        this.manageEcom.getCustomerById().then((data) => {
            lastName.innerHTML = data.body.lastName as string;
        });

        const dateOfBirthLabel = createElement({ tag: 'div', classes: ['label'] });
        dateOfBirthLabel.innerText = 'DATE OF BIRTH';
        const dateOfBirth = createElement({ tag: 'div', classes: ['info'] });
        this.manageEcom.getCustomerById().then((data) => {
            dateOfBirth.innerHTML = data.body.dateOfBirth as string;
        });

        sectionInfo.append(firstNameLabel, firstName, lastNameLabel, lastName, dateOfBirthLabel, dateOfBirth);

        section.append(sectionHead, sectionInfo);

        return section;
    }

    private createAdressSection(): HTMLElement {
        const section = createElement({ tag: 'div', classes: ['section-address'] });
        const sectionHead = createElement({ tag: 'div', classes: ['section-address__head'] });
        const title = createElement({ tag: 'div', classes: ['head-title'] });
        title.textContent = 'Addresses';
        const button = new Button('bordered', 'button-set-default', 'Set default');
        sectionHead.append(title, button.getComponent());

        const sectionInfo = createElement({ tag: 'div', classes: ['section-address__content'] });
        this.manageEcom.getCustomerById().then((data) => {
            for (let i = 0; i < data.body.addresses.length; i += 1) {
                const addressWrapper = createElement({ tag: 'div', classes: ['address-wrapper'] });
                const address = createElement({ tag: 'div', classes: ['address-info'] });
                const buttons = createElement({ tag: 'div', classes: ['address-buttons'] });
                const addressShippingIcon = new IconButton({ icon: iconShipping, type: 'clear' });
                const addressBillingIcon = new IconButton({ icon: iconBilling, type: 'clear' });
                buttons.append(addressShippingIcon.getComponent(), addressBillingIcon.getComponent());
                address.innerHTML = `${data.body.addresses[i].streetName} ${data.body.addresses[i].city} ${data.body.addresses[i].postalCode} ${data.body.addresses[i].country}`;
                addressWrapper.append(address, buttons);
                sectionInfo.append(addressWrapper);
            }
        });

        section.append(sectionHead, sectionInfo, this.buttonAddress.getComponent());

        return section;
    }
}
