import './login.scss';

import createElement from '../../utils/create-element';
import { AppStore } from '../../store/app-store';
import { Page } from '../abstract/page';
import { PageName } from '../../types';
import NavigationBar from '../../components/navigation-bar/navigation-bar';
import InputField from '../../components/input/input';
import { Button } from '../../components/button/button';

const NavLinks: PageName[] = [PageName.LOGIN, PageName.REGISTRATION];

export class LoginPage extends Page {
    private appStore: AppStore;
    private menuEl: NavigationBar;
    private loginButton: Button;

    constructor(appStore: AppStore) {
        super();
        this.appStore = appStore;
        this.menuEl = new NavigationBar(this.appStore, NavLinks, 'dark');
        this.loginButton = new Button('filled', 'button-login', 'Login');
    }

    public render(): void {
        this.html = document.createElement('div');
        this.html.className = 'login-page';
        this.html.innerHTML = 'login-page';
        this.html.append(this.createWrapper());
    }

    private createWrapper(): HTMLElement {
        const wrapperEl = createElement({ tag: 'div', classes: ['login-page__wrapper'] });
        wrapperEl.append(this.createFormWrapper());
        return wrapperEl;
    }

    private createFormWrapper(): HTMLElement {
        const formWrapper = createElement({ tag: 'div', classes: ['login-page__form-wrapper'] });
        const wrapperImage = createElement({ tag: 'div', classes: ['wrapper__image'] });
        formWrapper.append(
            wrapperImage,
            this.createNavigation(),
            this.createLoginTitle(),
            this.createLoginForm(),
            this.loginButton.getComponent()
        );
        return formWrapper;
    }

    private createNavigation(): HTMLElement {
        const formNavigation = createElement({ tag: 'div', classes: ['form-wrapper__navigation'] });
        const menuEl = this.menuEl.getComponent();
        menuEl.classList.add('login__menu');
        formNavigation.append(menuEl);
        return formNavigation;
    }

    private createLoginTitle(): HTMLElement {
        const loginTitle = createElement({ tag: 'h3', classes: ['form-wrapper__title'] });
        loginTitle.textContent = 'Login';
        return loginTitle;
    }

    private createLoginForm(): HTMLElement {
        const loginForm = createElement({ tag: 'form', classes: ['form'] });
        loginForm.append(this.createEmailInput(), this.createPasswordLabel());
        return loginForm;
    }

    private createEmailInput(): HTMLElement {
        const emailInput = new InputField(
            this.appStore,
            'email',
            'email',
            'username',
            'Enter your Username'
        ).getComponent();
        return emailInput;
    }

    private createPasswordLabel(): HTMLElement {
        const passwordInput = new InputField(
            this.appStore,
            'password',
            'password',
            'Password',
            'Enter your Password'
        ).getComponent();
        passwordInput.classList.add('password-icon');
        return passwordInput;
    }
}
