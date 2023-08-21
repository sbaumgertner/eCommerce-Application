import './login.scss';
import '../registration/registration.scss';

import createElement from '../../utils/create-element';
import { AppStore } from '../../store/app-store';
import { Page } from '../abstract/page';
import { StoreEventType } from '../../types';
import InputField from '../../components/input-field/input-field';
import { Button } from '../../components/button/button';
import { LoginAction } from '../../store/action/loginAction';
import { LoginStore, LoginValidationErrors } from '../../store/login-store';
import LoginWrapper from '../../components/login-wrapper/login-wrapper';
import { Validation } from '../../utils/validation';
import ClosePasswordButton from '../../components/button/passwordButton/openButton';
import OpenPasswordButton from '../../components/button/passwordButton/closeButton';

export class LoginPage extends Page {
    private appStore: AppStore;
    private button: Button;
    private loginAction: LoginAction;
    private loginStore: LoginStore;
    private emailField: InputField;
    private passwordField: InputField;
    private apiError: HTMLElement;

    constructor(appStore: AppStore) {
        super();
        this.appStore = appStore;
        this.loginAction = new LoginAction();

        this.button = new Button('filled', 'button-login', 'Login');
        this.emailField = new InputField('email', 'email', 'Email', 'Enter your e-mail');
        this.passwordField = new InputField('password', 'password', 'Password', 'Enter your password');
        this.loginStore = new LoginStore();
        this.apiError = createElement({ tag: 'div', classes: ['api-error'] });
        this.loginStore.addChangeListener(StoreEventType.LOGIN_ERROR, this.onStoreChange.bind(this));
        this.createPasswordButton();
    }

    public render(): void {
        this.html = document.createElement('div');
        this.html.className = 'login-page';
        this.html.append(this.createWrapper());
        this.addEventListeners();
    }

    private createWrapper(): HTMLElement {
        const wrapper = new LoginWrapper(this.appStore, 'Login', this.createFields(), this.button);
        return wrapper.getComponent();
    }

    private createFields(): HTMLElement {
        const div = createElement({ tag: 'div', classes: ['registration-fields'] });
        div.append(this.emailField.getComponent(), this.passwordField.getComponent(), this.apiError);
        return div;
    }

    private createPasswordButton(): void {
        const closeButton = new ClosePasswordButton();
        const openButton = new OpenPasswordButton();
        this.passwordField.getComponent().append(closeButton.getComponent(), openButton.getComponent());
        closeButton.openPassword(openButton.getComponent());
        openButton.closePassword(closeButton.getComponent());
    }

    public addEventListeners(): void {
        this.button.getComponent().addEventListener('click', () => {
            this.loginAction.login({ email: this.emailField.getValue(), password: this.passwordField.getValue() });
        });
        this.emailField.addValidation(Validation.checkEmail);
        this.passwordField.addValidation(Validation.checkPassword);
    }

    protected onStoreChange(): void {
        const errors: LoginValidationErrors = this.loginStore.getValidationErrors() as LoginValidationErrors;
        this.emailField.setError(errors.email || '');
        this.passwordField.setError(errors.password || '');
        this.apiError.textContent = this.loginStore.getLoginError();
    }
}
