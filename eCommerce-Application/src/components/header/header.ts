import './header.scss';
import { ElementParams, LinkProps, PageName } from '../../types';
import Component from '../abstract/component';
import createElement from '../../utils/create-element';
import htmlToElement from '../../utils/html-to-element';
import NavigationBar from '../navigation-bar/navigation-bar';
import { AppStore } from '../../store/app-store';
import { RouteAction } from '../../store/action/routeAction';
import IconWithCounter from '../icon-with-counter/icon-with-counter';

import darkLogoImg from '../../assets/logo-dark.svg';
import cartIcon from '../../assets/icons/icon-cart.svg';
import userIcon from '../../assets/icons/icon-user.svg';

const HeaderNavLinks: LinkProps[] = [
    {
        page: PageName.CATALOG,
        text: 'Catalog',
    },
    {
        page: PageName.ABOUT_US,
        text: 'About us',
    },
];

export default class Header extends Component {
    private routeAction: RouteAction = new RouteAction();

    constructor(private appStore: AppStore) {
        const headerParams: ElementParams = {
            tag: 'header',
            classes: ['header'],
        };
        super(headerParams);
        this.render();
    }

    public render(): void {
        this.componentElem.innerHTML = '';
        this.componentElem.append(this.createWrapper());
    }

    private createWrapper(): HTMLElement {
        const wrapperEl = createElement({ tag: 'div', classes: ['header__wrapper'] });
        const navBar = new NavigationBar(this.appStore, HeaderNavLinks, 'dark').getComponent();
        const logoEl = this.createLogo();
        const buttonBarEl = this.createButtonBar();
        wrapperEl.append(navBar, logoEl, buttonBarEl);
        return wrapperEl;
    }

    private createLogo(): HTMLElement {
        const logoEl = htmlToElement(`<a class="header__logo">${darkLogoImg}</div>`);
        logoEl.addEventListener('click', () => this.routeAction.changePage({ addHistory: true, page: PageName.INDEX }));
        return logoEl;
    }

    private createButtonBar(): HTMLElement {
        const cartIconInstance = new IconWithCounter(cartIcon, 5);
        const cartIconEl = cartIconInstance.getComponent();
        const userIconEl = htmlToElement(`<a class="user-icon">${userIcon}</a>`);
        const btnBarEl = createElement({
            tag: 'nav',
            classes: ['header__btn-bar'],
        });
        const loginBtnEl = createElement({
            tag: 'div',
            classes: ['button'],
            text: 'Login',
        });
        const registrationBtnEl = createElement({
            tag: 'div',
            classes: ['button'],
            text: 'Registration',
        });

        cartIconEl.addEventListener('click', () => {
            cartIconInstance.setCount(Number(cartIconEl.dataset.count) + 1);
        });
        loginBtnEl.addEventListener('click', () =>
            this.routeAction.changePage({ addHistory: true, page: PageName.LOGIN })
        );
        registrationBtnEl.addEventListener('click', () =>
            this.routeAction.changePage({ addHistory: true, page: PageName.REGISTRATION })
        );

        btnBarEl.append(cartIconEl, userIconEl, loginBtnEl, registrationBtnEl);

        return btnBarEl;
    }
}
