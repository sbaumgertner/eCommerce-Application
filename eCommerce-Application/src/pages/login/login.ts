import './login.scss';
import '../registration/registration.scss';

import createElement from '../../utils/create-element';
import { AppStore } from '../../store/app-store';
import { Page } from '../abstract/page';
import { StoreEventType } from '../../types';
import InputField from '../../components/input-field/input-field';
import { Button, IconButton } from '../../components/button/button';
import { LoginAction } from '../../store/action/loginAction';
import { LoginStore } from '../../store/login-store';
import LoginWrapper from '../../components/login-wrapper/login-wrapper';
import eyeClosedIcon from '../../assets/icons/icon-eye-close.svg';

export class LoginPage extends Page {
    private appStore: AppStore;
    private button: Button;
    private loginAction: LoginAction;
    private loginStore: LoginStore;
    private emailField: InputField;
    private passwordField: InputField;

    constructor(appStore: AppStore) {
        super();
        this.appStore = appStore;
        this.loginAction = new LoginAction();

        this.button = new Button('filled', 'button-login', 'Login');
        this.emailField = new InputField('email', 'email', 'Email', 'Enter your e-mail');
        this.passwordField = new InputField('password', 'password', 'Password', 'Enter your password');
        this.loginStore = new LoginStore();
        this.loginStore.addChangeListener(StoreEventType.LOGIN_ERROR, this.onStoreChange.bind(this));
    }

    public render(): void {
        this.html = document.createElement('div');
        this.html.className = 'login-page';
        this.html.append(this.createWrapper());
        this.createPasswordButton();
        this.addEventListeners();
    }

    private createWrapper(): HTMLElement {
        const wrapper = new LoginWrapper(this.appStore, 'Login', this.createFields(), this.button);
        return wrapper.getComponent();
    }

    private createFields(): HTMLElement {
        const div = createElement({ tag: 'div', classes: ['registration-fields'] });
        div.append(this.emailField.getComponent(), this.passwordField.getComponent());
        return div;
    }

    private createPasswordButton(): void {
        const passwordButton = new IconButton({ icon: eyeClosedIcon, type: 'clear' }).getComponent();
        passwordButton.classList.add('eye-button');
        this.passwordField.getComponent().append(passwordButton);
        passwordButton.addEventListener('click', (): void => {
            if ((document.querySelectorAll('.input')[1] as HTMLInputElement).type === 'password') {
                (document.querySelectorAll('.input')[1] as HTMLInputElement).type = 'text';
            } else {
                (document.querySelectorAll('.input')[1] as HTMLInputElement).type = 'password';
            }
        });
    }

    public addEventListeners(): void {
        this.button.getComponent().addEventListener('click', () => {
            this.loginAction.login({ email: this.emailField.getValue(), password: this.passwordField.getValue() });
        });
    }

    protected onStoreChange(): void {
        this.emailField.setError(this.loginStore.getEmailError());
        this.passwordField.setError(this.loginStore.getPasswordError());
        //this.emailField.setError(this.loginStore.getLoginError());
    }
}
