import './registration.scss';

import { Button } from '../../components/button/button';
import LoginWrapper from '../../components/login-wrapper/login-wrapper';
import { AppStore } from '../../store/app-store';
import { Page } from '../abstract/page';
import createElement from '../../utils/create-element';
import InputField from '../../components/input/input';

export class RegisterPage extends Page {
    private appStore: AppStore;

    private firstName: InputField;

    constructor(appStore: AppStore) {
        super();
        this.appStore = appStore;

        this.firstName = new InputField('text', 'firstname', 'FIRST NAME', 'Enter your First name');
    }

    public render(): void {
        this.html = document.createElement('div');
        this.html.className = 'registration-page';
        this.html.append(this.createWrapper());
    }

    private createWrapper(): HTMLElement {
        const button = new Button('filled', 'registration-button', 'Registration');
        const wrapper = new LoginWrapper(this.appStore, 'Registration', this.createFields(), button);

        return wrapper.getComponent();
    }

    private createFields(): HTMLElement {
        const div = createElement({ tag: 'div', classes: ['registration-fields'] });
        div.append(this.firstName.getComponent());
        return div;
    }

    public addEventListeners(): void {
        //this.loginButton.getComponent().addEventListener('click', () => {
        //   this.routeAction.changePage({ addHistory: true, page: PageName.INDEX });
        //});
    }
}
