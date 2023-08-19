import './registration.scss';

import { Button } from '../../components/button/button';
import LoginWrapper from '../../components/login-wrapper/login-wrapper';
import { AppStore } from '../../store/app-store';
import { Page } from '../abstract/page';
import createElement from '../../utils/create-element';
import InputField from '../../components/input-field/input-field';
import { RegistrationStore } from '../../store/registration-store';
import { RegistrationAction } from '../../store/action/registrationAction';
import { StoreEventType } from '../../types';

export class RegisterPage extends Page {
    private appStore: AppStore;
    private registrationStore: RegistrationStore;
    private registrationAction: RegistrationAction;

    private firstNameField: InputField;
    private button: Button;

    constructor(appStore: AppStore) {
        super();
        this.appStore = appStore;
        this.registrationStore = new RegistrationStore();
        this.registrationAction = new RegistrationAction();
        this.button = new Button('filled', 'registration-button', 'Registration');

        this.firstNameField = new InputField('text', 'firstname', 'FIRST NAME', 'Enter your First name');
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
        const div = createElement({ tag: 'div', classes: ['registration-fields'] });
        div.append(this.firstNameField.getComponent());
        return div;
    }

    public addEventListeners(): void {
        this.button.getComponent().addEventListener('click', () => {
            this.registrationAction.registration({ firstName: this.firstNameField.getValue() });
        });
    }

    protected onStoreChange(): void {
        this.firstNameField.setError(this.registrationStore.getFirstNameError());
    }
}
