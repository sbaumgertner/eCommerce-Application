import './login-wrapper.scss';

import { AppStore } from '../../store/app-store';
import createElement from '../../utils/create-element';
import Component from '../abstract/component';
import { Button } from '../button/button';
import NavigationBar from '../navigation-bar/navigation-bar';
import LoginNavigationBar from './login-navigation-bar';

export default class LoginWrapper extends Component {
    private menuEl: NavigationBar;

    constructor(appStore: AppStore, title: string, content: HTMLElement, button: Button) {
        super({ tag: 'div', classes: ['login-wrapper'] });

        this.menuEl = new LoginNavigationBar(appStore);
        this.componentElem.append(
            this.createNavigation(),
            createElement({ tag: 'h3', classes: ['login-wrapper__title'], text: title }),
            content,
            button.getComponent()
        );
    }

    private createNavigation(): HTMLElement {
        const formNavigation = createElement({ tag: 'div', classes: ['login-wrapper__navigation'] });
        const menuEl = this.menuEl.getComponent();
        menuEl.classList.add('login__menu');
        formNavigation.append(menuEl);
        return formNavigation;
    }
}
