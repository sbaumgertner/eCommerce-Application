import './header.scss';
import { ElementParams, LinkProps, PageName, StoreEventType } from '../../types';
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
import { UserTypeAction } from '../../store/action/userTypeAction';

const HeaderNavLinks: LinkProps[] = [
    {
        page: PageName.CATALOG,
        text: 'Catalog',
    },
    {
        page: PageName.ABOUT_US,
        text: 'About us',
    },
    {
        page: PageName.ACCOUNT,
        text: 'Account',
    },
];

export default class Header extends Component {
    private routeAction: RouteAction = new RouteAction();
    private userAction: UserTypeAction = new UserTypeAction();
    private isAnonUser: boolean;

    constructor(private appStore: AppStore) {
        const headerParams: ElementParams = {
            tag: 'header',
            classes: ['header'],
        };
        super(headerParams);
        this.appStore.addChangeListener(StoreEventType.USER_TYPE_CHANGE, this.onUserType.bind(this));
        this.isAnonUser = this.appStore.getIsAnonUser();
        this.render();
    }

    protected onUserType(): void {
        this.isAnonUser = this.appStore.getIsAnonUser();
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
        const btnBarEl = createElement({ tag: 'nav', classes: ['header__btn-bar'] });
        const cartIconEl = this.createCartIcon();
        const userIconEl = this.createUserIcon();
        const loginBtnEl = this.createloginButton();
        const registrationBtnEl = this.createRegistrationButton();
        const logoutBtn = this.createAccountMenu();

        btnBarEl.append(cartIconEl, userIconEl, loginBtnEl, registrationBtnEl, logoutBtn);

        return btnBarEl;
    }

    private createCartIcon(): HTMLElement {
        const cartIconInstance = new IconWithCounter(cartIcon, 0);
        const cartIconEl = cartIconInstance.getComponent();

        // поменять на лиснер изменения в сторе корзины
        cartIconEl.addEventListener('click', () => {
            cartIconInstance.setCount(Number(cartIconEl.dataset.count) + 1);
        });

        cartIconEl.addEventListener('click', () =>
            this.routeAction.changePage({ addHistory: true, page: PageName.CART })
        );

        return cartIconEl;
    }

    private createUserIcon(): HTMLElement {
        const userIconEl = htmlToElement(`<a class="user-icon">${userIcon}</a>`);

        userIconEl.addEventListener('click', () =>
            this.routeAction.changePage({ addHistory: true, page: PageName.ACCOUNT })
        );
        return userIconEl;
    }

    private createloginButton(): HTMLElement {
        const loginBtnEl = createElement({
            tag: 'div',
            classes: ['button'],
            text: 'Login',
        });

        loginBtnEl.addEventListener('click', () => {
            this.userAction.changeUserType(false); // удалить после проверки
            this.routeAction.changePage({ addHistory: true, page: PageName.LOGIN });
        });
        return loginBtnEl;
    }

    private createRegistrationButton(): HTMLElement {
        const registrationBtnEl = createElement({
            tag: 'div',
            classes: ['button'],
            text: 'Registration',
        });

        registrationBtnEl.addEventListener('click', () => {
            this.routeAction.changePage({ addHistory: true, page: PageName.REGISTRATION });
        });
        return registrationBtnEl;
    }

    private createAccountMenu(): HTMLElement {
        const logoutBtnEl = createElement({
            tag: 'div',
            classes: ['button'],
            text: 'Logout',
        });

        logoutBtnEl.addEventListener('click', () => this.userAction.changeUserType(true));
        return logoutBtnEl;
    }
}
